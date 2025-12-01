import { getRedis } from '../_lib/redis.js'
import bcrypt from 'bcryptjs'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const {account,password,name} = req.body||{}
  if(!account||!password) return res.status(400).json({ok:false,error:'missing fields'})
  const r=await getRedis()
  const exists = await r.get(`userByAccount:${account}`)
  if(exists) return res.status(409).json({ok:false,error:'account exists'})
  const id = await r.incr('user:seq')
  const hash = await bcrypt.hash(password,10)
  const user = {id:String(id), account, name:name||account, createdAt:Date.now()}
  await r.hSet(`user:${id}`,{...user,password:hash})
  await r.set(`userByAccount:${account}`, String(id))
  res.status(200).json({ok:true,data:{id:String(id),account,name:user.name}})
}

