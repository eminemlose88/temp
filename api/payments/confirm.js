import { requireAdmin } from '../_lib/auth.js'
import { setPaymentStatus, getPayment, persistPaymentToSupabase } from '../_lib/payments.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  if(!requireAdmin(req,res)) return
  const {id,status='succeeded'}=req.body||{}
  if(!id) return res.status(400).json({ok:false,error:'missing id'})
  await setPaymentStatus(id,status)
  const p = await getPayment(id)
  await persistPaymentToSupabase(p)
  res.status(200).json({ok:true,data:{status}})
}
