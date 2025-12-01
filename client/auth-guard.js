;(async function(){
  try{
    const r = await fetch('/api/auth/me')
    if(r.status===401){ location.href='index.html'; return }
    const j = await r.json().catch(()=>null)
    if(!j||!j.ok){ location.href='index.html'; }
  }catch(_){ location.href='index.html' }
})()
