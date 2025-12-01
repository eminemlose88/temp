import { getSessionUserId } from '../_lib/auth.js'
import { getRedis } from '../_lib/redis.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const uid = await getSessionUserId(req)
  if(!uid) return res.status(401).json({ok:false,error:'unauthorized'})
  const {amount,currency='KRW',method='unknown',reference=''}=req.body||{}
  if(!amount) return res.status(400).json({ok:false,error:'missing amount'})
  const r=await getRedis()
  const id = await r.incr('tip:seq')
  const time=Date.now()
  const tip={id:String(id),userId:String(uid),amount:Number(amount),currency,method,reference,status:'pending',createdAt:time}
  await r.hSet(`tip:${id}`,Object.fromEntries(Object.entries(tip).map(([k,v])=>[k,String(v)])))
  await r.zAdd(`user:${uid}:tips`,[{score:time, value:String(id)}])
  await r.incrBy('tips:total', Number(amount))
  res.status(200).json({ok:true,data:{id:String(id)}})
}

