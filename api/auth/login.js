import { getRedis } from '../_lib/redis.js'
import { createSession, setSessionCookie } from '../_lib/auth.js'
import { supabasePasswordSignIn } from '../_lib/supabase.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const {account,password}=req.body||{}
  if(!account||!password) return res.status(400).json({ok:false,error:'missing fields'})
  let r
  try{ r=await getRedis() }catch(e){ return res.status(503).json({ok:false,error:'service unavailable'}) }
  // 首次通过 Supabase 验证
  let sb
  try{
    sb = await supabasePasswordSignIn(account,password)
  }catch(e){
    return res.status(401).json({ok:false,error:String(e.message||e)})
  }
  const id = await r.get(`userByAccount:${account}`)
  let uid=id
  if(!uid){
    // 如果 Redis 中不存在，则从 Supabase 取回用户数据或创建本地索引
    const nid = await r.incr('user:seq')
    await r.hSet(`user:${nid}`,{id:String(nid),account,name:account,createdAt:String(Date.now()),sb_user_id: sb.user?.id||''})
    await r.set(`userByAccount:${account}`,String(nid))
    uid=String(nid)
  }
  const ttlSec = 60*60*24*7
  let token
  try{ token = await createSession({uid, sbAccess: sb.access_token, sbRefresh: sb.refresh_token, sbUserId: sb.user?.id||''}, ttlSec) }
  catch(e){ return res.status(503).json({ok:false,error:'service unavailable'}) }
  const data = await r.hGetAll(`user:${uid}`)
  const user = { id: String(uid), account: data.account, name: data.name||account, createdAt: Number(data.createdAt||0), sbUserId: sb.user?.id||'' }
  // 在 Redis 中缓存用户资料 10 分钟
  await r.set(`cache:user:${uid}`, JSON.stringify(user), { EX: 60*10 })
  setSessionCookie(res, token, ttlSec)
  res.status(200).json({ok:true,data:{token,user}})
}
