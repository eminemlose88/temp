const tabs = {
  home: document.getElementById('tab-home'),
  mypage: document.getElementById('tab-mypage')
}
const navItems = Array.from(document.querySelectorAll('.nav-item'))

function switchTab(key){
  Object.values(tabs).forEach(el=>el.classList.remove('active'))
  tabs[key].classList.add('active')
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.tab===key))
}

navItems.forEach(n=>n.addEventListener('click',()=>switchTab(n.dataset.tab)))

function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

async function initUser(){
  const pname=document.getElementById('pname')
  const pid=document.getElementById('pid')
  try{
    const r=await fetch('/api/auth/me')
    const j=await r.json()
    const name=(j&&j.ok&&j.data&&j.data.name)||'用户'
    if(pname)pname.textContent=name
  }catch(_){ if(pname)pname.textContent='用户' }
  if(pid)pid.textContent='NO.'+String(Math.floor(Math.random()*1e7)).padStart(7,'0')
}

const logoutBtn=document.getElementById('logout-btn')
if(logoutBtn){
  logoutBtn.addEventListener('click',async()=>{
    try{await fetch('/api/auth/logout',{method:'POST'})}catch(_){/* ignore */}
    location.href='index.html'
  })
}

initUser()
switchTab('home')
