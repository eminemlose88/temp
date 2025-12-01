import { kv, ok, bad } from '../util.js'

export default async function handler(req,res){
  if(req.method!=='POST') return bad(res,'invalid method')
  const {userId,name}=req.body||{}
  if(!userId||!name) return bad(res,'missing fields')
  const key=`user:${userId}`
  const now=Date.now()
  await kv.set(key,{id:userId,name,lastSeen:now},{ex:60*60*24*90})
  await kv.zadd('users:index',{score:now,member:userId})
  ok(res,{id:userId})
}

