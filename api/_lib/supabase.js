export async function supabasePasswordSignIn(email, password){
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':key,'Authorization':`Bearer ${key}`},
    body: JSON.stringify({email,password})
  })
  const data = await res.json()
  if(!res.ok) throw new Error(data.error_description||data.error||'auth failed')
  return data
}

export async function supabaseSignUp(email, password){
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  const res = await fetch(`${url}/auth/v1/signup`,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':key,'Authorization':`Bearer ${key}`},
    body: JSON.stringify({email,password})
  })
  const data = await res.json().catch(()=>null)
  if(!res.ok) throw new Error(data?.error_description||data?.error||'signup failed')
  return data
}
