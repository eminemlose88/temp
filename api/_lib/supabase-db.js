const base = () => process.env.SUPABASE_URL
const key = () => process.env.SUPABASE_ANON_KEY

export async function sbPost(table, body, accessToken){
  const r = await fetch(`${base()}/rest/v1/${table}`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'apikey': key(),
      'Authorization': `Bearer ${accessToken||key()}`
    },
    body: JSON.stringify(body)
  })
  const data = await r.json().catch(()=>null)
  if(!r.ok) throw new Error(data?.message||'supabase insert failed')
  return data
}

export async function sbGet(table, params, accessToken){
  const qs = new URLSearchParams(params).toString()
  const url = `${base()}/rest/v1/${table}?${qs}`
  const r = await fetch(url,{
    headers:{ 'apikey':key(), 'Authorization': `Bearer ${accessToken||key()}` }
  })
  const data = await r.json()
  if(!r.ok) throw new Error(data?.message||'supabase get failed')
  return data
}

