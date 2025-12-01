import { getSession, clearSessionCookie } from '../_lib/auth.js'
import { getRedis } from '../_lib/redis.js'

export default async function handler(req,res){
  try{
    const sess = await getSession(req)
    // 尝试注销 Supabase 会话（如果可用）
    try{
      const url = process.env.SUPABASE_URL
      const key = process.env.SUPABASE_ANON_KEY
      if(url && key && sess?.sbAccess){
        await fetch(`${url}/auth/v1/logout`,{ method:'POST', headers:{ 'apikey':key, 'Authorization':`Bearer ${sess.sbAccess}` } })
      }
    }catch(_){/* ignore */}
    // 移除后端会话令牌
    try{
      const r = await getRedis()
      const auth = (req.headers['authorization']||'').replace('Bearer ','')
      const cookie = (req.headers['cookie']||'')
      let token = ''
      if(auth) token = auth
      if(!token && cookie){ const m=cookie.match(/auth_token=([^;]+)/); if(m) token = m[1] }
      if(token) await r.del(`session:${token}`)
    }catch(_){/* ignore */}
    clearSessionCookie(res)
    res.status(200).json({ok:true})
  }catch(e){
    clearSessionCookie(res)
    res.status(200).json({ok:true})
  }
}
