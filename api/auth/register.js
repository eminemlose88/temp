import { getRedis } from '../_lib/redis.js'
import { supabaseSignUp } from '../_lib/supabase.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const {account,password,name} = req.body||{}
  if(!account||!password) return res.status(400).json({ok:false,error:'missing fields'})
  const r=await getRedis()
  const exists = await r.get(`userByAccount:${account}`)
  if(exists) return res.status(409).json({ok:false,error:'account exists'})
  try{
    const sb = await supabaseSignUp(account,password)
    const id = await r.incr('user:seq')
    const user = {id:String(id), account, name:name||account, createdAt:String(Date.now()), sb_user_id: sb?.user?.id||''}
    await r.hSet(`user:${id}`, user)
    await r.set(`userByAccount:${account}`, String(id))
    res.status(200).json({ok:true,data:{id:String(id),account,name:user.name}})
  }catch(e){
    res.status(400).json({ok:false,error:String(e.message||e)})
  }
}
