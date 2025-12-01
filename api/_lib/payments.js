import crypto from 'node:crypto'
import { getRedis } from './redis.js'
import { sbPost, sbGet } from './supabase-db.js'

export async function newPaymentId(){
  const r=await getRedis(); const id=await r.incr('payment:seq'); return String(id)
}

export async function createPayment({userId,amount,currency,method,reference}){
  const r=await getRedis(); const id=await newPaymentId(); const time=Date.now()
  const providerRef='pay_'+crypto.randomBytes(8).toString('hex')
  const data={id,userId:String(userId),amount:Number(amount),currency:String(currency||'KRW'),method:String(method||'unknown'),reference:reference?String(reference):'',status:'pending',providerRef,createdAt:time}
  await r.hSet(`payment:${id}`,Object.fromEntries(Object.entries(data).map(([k,v])=>[k,String(v)])))
  await r.zAdd(`user:${userId}:payments`,[{score:time,value:String(id)}])
  await r.set(`paymentByRef:${providerRef}`,String(id))
  return data
}

export async function getPayment(id){
  const r=await getRedis(); const p=await r.hGetAll(`payment:${id}`); return p&&p.id?p:null
}

export async function setPaymentStatus(id,status,providerId){
  const r=await getRedis(); const patch={status:String(status)}; if(providerId) patch.providerId=String(providerId); await r.hSet(`payment:${id}`,patch)
}

export function verifySignature(rawBody, signature){
  const sec=process.env.PAYMENT_WEBHOOK_SECRET||''; if(!sec) return false
  const h=crypto.createHmac('sha256',sec).update(rawBody).digest('hex')
  return h===String(signature||'')
}

export async function persistPaymentToSupabase(p){
  try{
    const access=null
    await sbPost('payments',{ amount:Number(p.amount), currency:p.currency, method:p.method, reference:p.reference, created_at:new Date(Number(p.createdAt)).toISOString(), user_id:p.userId, provider_ref:p.providerRef, provider_id:p.providerId||null, status:p.status }, access)
  }catch(_){/* */}
}
