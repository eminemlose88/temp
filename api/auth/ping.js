import { touchSession } from '../_lib/auth.js'

export default async function handler(req,res){
  try{
    const ok = await touchSession(req)
    if(!ok) return res.status(401).json({ok:false})
    res.status(200).json({ok:true})
  }catch(e){
    res.status(500).json({ok:false,error:String(e?.message||e)})
  }
}
