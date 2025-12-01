const API = 'https://api.vercel.com/v2/blob'

function token(){
  return process.env.BLOB_READ_WRITE_TOKEN||''
}

export async function blobUpload({ filename, folder='', buffer, contentType='application/octet-stream', access='public', addRandomSuffix=true }){
  const t = token(); if(!t) throw new Error('Missing BLOB_READ_WRITE_TOKEN')
  const url = API + '/upload'
  const form = new FormData()
  const name = folder ? `${folder.replace(/\/$/,'')}/${filename}` : filename
  form.append('file', new Blob([buffer], { type: contentType }), name)
  form.append('access', access)
  form.append('addRandomSuffix', String(addRandomSuffix))
  const r = await fetch(url, { method:'POST', headers:{ Authorization: `Bearer ${t}` }, body: form })
  const j = await r.json().catch(()=>null)
  if(!r.ok) throw new Error(j?.error||j?.message||'blob upload failed')
  return j
}

export async function blobList(prefix){
  const t = token(); if(!t) throw new Error('Missing BLOB_READ_WRITE_TOKEN')
  const u = API + '/list?prefix=' + encodeURIComponent(prefix||'')
  const r = await fetch(u, { headers:{ Authorization: `Bearer ${t}` } })
  const j = await r.json().catch(()=>null)
  if(!r.ok) throw new Error(j?.error||j?.message||'blob list failed')
  return j
}

export async function blobDelete(urls){
  const t = token(); if(!t) throw new Error('Missing BLOB_READ_WRITE_TOKEN')
  const u = API
  const body = { blobs: (Array.isArray(urls)?urls:[urls]).map(u=>({ url: u })) }
  const r = await fetch(u, { method:'DELETE', headers:{ Authorization: `Bearer ${t}`, 'Content-Type':'application/json' }, body: JSON.stringify(body) })
  const j = await r.json().catch(()=>null)
  if(!r.ok) throw new Error(j?.error||j?.message||'blob delete failed')
  return j
}
