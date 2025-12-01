import { requireAdmin } from '../_lib/auth.js'
import { blobUpload } from '../_lib/blob.js'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method'})
  if(!requireAdmin(req,res)) return
  const { folder='banners', filename, contentBase64, contentType='image/jpeg' } = req.body||{}
  if(!filename||!contentBase64) return res.status(400).json({ok:false,error:'missing fields'})
  const b64 = String(contentBase64).split(',').pop()
  const buffer = Buffer.from(b64,'base64')
  try{
    const r = await blobUpload({ filename, folder, buffer, contentType, access:'public', addRandomSuffix:true })
    res.status(200).json({ok:true,data:r})
  }catch(e){
    res.status(400).json({ok:false,error:String(e?.message||e)})
  }
}
