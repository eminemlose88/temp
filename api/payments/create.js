import { getSessionUserId } from '../_lib/auth.js'
import { createPayment } from '../_lib/payments.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  const uid = await getSessionUserId(req)
  if(!uid) return res.status(401).json({ok:false,error:'unauthorized'})
  const {amount,currency='KRW',method='unknown',reference=''}=req.body||{}
  if(!amount) return res.status(400).json({ok:false,error:'missing amount'})
  const p = await createPayment({userId:uid,amount,currency,method,reference})
  const redirectUrl = `https://pay.example/checkout?ref=${encodeURIComponent(p.providerRef)}`
  res.status(200).json({ok:true,data:{id:p.id,provider:{redirectUrl,pref:p.providerRef}}})
}
