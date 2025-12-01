import { verifySignature, setPaymentStatus, getPayment, persistPaymentToSupabase } from '../_lib/payments.js'
import { getRedis } from '../_lib/redis.js'

export default async function handler(req,res){
  try{
    const sig = req.headers['x-signature']||''
    const raw = JSON.stringify(req.body||{})
    const ok = verifySignature(raw, sig)
    if(!ok) return res.status(401).json({ok:false})
    const {ref,status,provider_id,amount,currency}=req.body||{}
    if(!ref||!status) return res.status(400).json({ok:false})
    const r=await getRedis()
    const id = await r.get(`paymentByRef:${ref}`)
    if(!id) return res.status(404).json({ok:false})
    await setPaymentStatus(id,status,provider_id)
    const p = await getPayment(id)
    await persistPaymentToSupabase(p)
    res.status(200).json({ok:true})
  }catch(e){
    res.status(500).json({ok:false})
  }
}
