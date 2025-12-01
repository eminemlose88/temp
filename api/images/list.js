import { blobList } from '../_lib/blob.js'

export default async function handler(req,res){
  try{
    const prefix = (req.query?.prefix||req.query?.p||'').toString()
    const r = await blobList(prefix)
    res.status(200).json({ok:true,data:r})
  }catch(e){
    res.status(400).json({ok:false,error:String(e?.message||e)})
  }
}
