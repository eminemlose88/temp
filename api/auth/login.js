import { getRedis } from '../_lib/redis.js'
import { createSession } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const {account,password}=req.body||{}
  if(!account||!password) return res.status(400).json({ok:false,error:'missing fields'})
  const r=await getRedis()
  const id = await r.get(`userByAccount:${account}`)
  if(!id) return res.status(401).json({ok:false,error:'invalid credentials'})
  const data = await r.hGetAll(`user:${id}`)
  const ok = await bcrypt.compare(password, data.password||'')
  if(!ok) return res.status(401).json({ok:false,error:'invalid credentials'})
  const token = await createSession(id)
  const user = { id: String(id), account: data.account, name: data.name, createdAt: Number(data.createdAt||0) }
  res.status(200).json({ok:true,data:{token,user}})
}
