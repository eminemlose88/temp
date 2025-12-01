import { getSessionUserId } from '../_lib/auth.js'
import { getRedis } from '../_lib/redis.js'

export default async function handler(req,res){
  const uid = await getSessionUserId(req)
  if(!uid) return res.status(401).json({ok:false,error:'unauthorized'})
  const r=await getRedis()
  const data=await r.hGetAll(`user:${uid}`)
  if(!data||!data.id) return res.status(404).json({ok:false,error:'not found'})
  delete data.password
  res.status(200).json({ok:true,data})
}

