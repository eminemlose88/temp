import { getRedis } from '../_lib/redis.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  if(!requireAdmin(req,res)) return
  const {account,password,name} = req.body||{}
  if(!account||!password) return res.status(400).json({ok:false,error:'missing fields'})
  const r=await getRedis()
  const exists = await r.get(`userByAccount:${account}`)
  if(exists){const data=await r.hGetAll(`user:${exists}`);delete data.password;return res.status(200).json({ok:true,data})}
  const id = await r.incr('user:seq')
  const hash = await bcrypt.hash(password,10)
  const user = {id:String(id), account, name:name||account, createdAt:String(Date.now())}
  await r.hSet(`user:${id}`,{...user,password:hash})
  await r.set(`userByAccount:${account}`, String(id))
  res.status(200).json({ok:true,data:user})
}

