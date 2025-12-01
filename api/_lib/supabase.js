export async function supabasePasswordSignIn(email, password){
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json',
      'apikey':key,
      'Authorization':`Bearer ${key}`
    },
    body: JSON.stringify({email,password})
  })
  let data
  try{ data = await res.json() }catch(_){ data = null }
  if(!res.ok){
    let msg = (data && (data.error_description||data.error)) || `supabase error ${res.status}`
    if(!data){
      try{
        const txt = await res.text()
        if(txt) msg = `${msg}: ${txt.slice(0,200)}`
      }catch(_){/* ignore */}
    }
    throw new Error(msg)
  }
  return data
}

export async function supabaseSignUp(email, password){
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  const res = await fetch(`${url}/auth/v1/signup`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json',
      'apikey':key,
      'Authorization':`Bearer ${key}`
    },
    body: JSON.stringify({email,password})
  })
  const data = await res.json().catch(()=>null)
  if(!res.ok){
    const msg = (data && (data.error_description||data.error)) || `supabase error ${res.status}`
    throw new Error(msg)
  }
  return data
}
