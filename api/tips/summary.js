import { kv, ok } from '../util.js'

export default async function handler(req,res){
  const total=Number(await kv.get('tips:total')||0)
  const users=await kv.zcard('users:index')
  ok(res,{total,users})
}

