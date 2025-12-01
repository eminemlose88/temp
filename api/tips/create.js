import { kv, ok, bad } from '../util.js'

export default async function handler(req,res){
  if(req.method!=='POST') return bad(res,'invalid method')
  const {userId,amount,currency,method,reference}=req.body||{}
  if(!userId||!amount||!currency||!method) return bad(res,'missing fields')
  const id=Math.random().toString(36).slice(2,10)
  const time=Date.now()
  const tip={id,userId,amount:Number(amount),currency,method,reference:reference||'',status:'pending',createdAt:time}
  await kv.set(`tip:${id}`,tip)
  await kv.zadd(`user_tips:${userId}`,{score:time,member:id})
  await kv.incrby('tips:total',Number(amount))
  ok(res,{id})
}

