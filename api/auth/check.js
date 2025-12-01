export default async function handler(req,res){
  try{
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_ANON_KEY
    if(!url||!key) return res.status(500).json({ok:false,error:'missing env'})
    const r = await fetch(`${url}/auth/v1/settings`,{
      headers:{
        'Accept':'application/json',
        'apikey':key,
        'Authorization':`Bearer ${key}`
      }
    })
    let data=null
    try{ data = await r.json() }catch(_){ data = null }
    res.status(200).json({ok:true,status:r.status,data})
  }catch(e){
    res.status(500).json({ok:false,error:String(e?.message||e)})
  }
}
