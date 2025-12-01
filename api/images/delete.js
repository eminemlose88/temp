import { requireAdmin } from '../_lib/auth.js'
import { blobDelete } from '../_lib/blob.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  if(!requireAdmin(req,res)) return
  const { urls=[] } = req.body||{}
  if(!urls||!(Array.isArray(urls)?urls.length:urls)) return res.status(400).json({ok:false,error:'missing urls'})
  try{
    const r = await blobDelete(urls)
    res.status(200).json({ok:true,data:r})
  }catch(e){
    res.status(400).json({ok:false,error:String(e?.message||e)})
  }
}
