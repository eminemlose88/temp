import { getRedis } from '../_lib/redis.js'

export default async function handler(req,res){
  const id=req.query.id
  if(!id) return res.status(400).json({ok:false,error:'missing id'})
  const r=await getRedis()
  const tip=await r.hGetAll(`tip:${id}`)
  if(!tip||!tip.id) return res.status(404).json({ok:false,error:'not found'})
  res.status(200).json({ok:true,data:{status:tip.status,tip}})
}

