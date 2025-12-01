import { getSessionUserId, getSession } from '../_lib/auth.js'
import { getRedis } from '../_lib/redis.js'
import { sbGet } from '../_lib/supabase-db.js'

export default async function handler(req,res){
  const uid = await getSessionUserId(req)
  if(!uid) return res.status(401).json({ok:false,error:'unauthorized'})
  const r=await getRedis()
  let tips=[]
  try{
    const sess=await getSession(req)
    if(sess?.sbAccess&&sess?.sbUserId){
      const rows = await sbGet('tips',{select:'id,amount,currency,method,reference,created_at', 'user_id':'eq.'+sess.sbUserId, order:'created_at.desc' }, sess.sbAccess)
      tips = rows.map(row=>({id:String(row.id||''), amount:row.amount, currency:row.currency, method:row.method, reference:row.reference, createdAt:row.created_at, status:'completed'}))
    }
  }catch(_){/* ignore */}
  if(!tips.length){
    const ids = await r.zRange(`user:${uid}:tips`,0,-1)
    tips = await Promise.all(ids.map(async id=>await r.hGetAll(`tip:${id}`)))
  }
  const total=tips.reduce((s,t)=>s+(Number(t.amount||0)),0)
  res.status(200).json({ok:true,data:{tips,total}})
}
