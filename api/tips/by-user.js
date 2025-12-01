import { kv, ok, bad } from '../util.js'

export default async function handler(req,res){
  if(req.method!=='GET') return bad(res,'invalid method')
  const userId=req.query.userId
  if(!userId) return bad(res,'missing userId')
  const ids=await kv.zrange(`user_tips:${userId}`,0,-1)
  const tips=await Promise.all(ids.map(id=>kv.get(`tip:${id}`)))
  const total=tips.reduce((s,t)=>s+(t?.amount||0),0)
  ok(res,{tips,total})
}

