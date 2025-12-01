import { kv, ok, bad } from '../util.js'

export default async function handler(req,res){
  const id=req.query.id
  if(!id) return bad(res,'missing id')
  const tip=await kv.get(`tip:${id}`)
  if(!tip) return bad(res,'not found')
  ok(res,{status:tip.status,tip})
}

