import { kv, ok, bad, requireAdmin } from '../util.js'

export default async function handler(req,res){
  if(req.method!=='POST') return bad(res,'invalid method')
  if(!requireAdmin(req,res)) return
  const {id,status}=req.body||{}
  if(!id) return bad(res,'missing id')
  const tip=await kv.get(`tip:${id}`)
  if(!tip) return bad(res,'not found')
  tip.status=status||'completed'
  tip.confirmedAt=Date.now()
  await kv.set(`tip:${id}`,tip)
  ok(res,{id,status:tip.status})
}

