const tabs = {
  home: document.getElementById('tab-home'),
  events: document.getElementById('tab-events'),
  videos: document.getElementById('tab-videos'),
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

async function loadImages(){
  try{
    const b = await fetch('/api/images/list?prefix=banners/').then(r=>r.json()).catch(()=>null)
    const p = await fetch('/api/images/list?prefix=profiles/').then(r=>r.json()).catch(()=>null)
    const bannerImg = document.querySelector('#tab-home .banner img')
    const burl = b&&b.ok&&b.data&&b.data.blobs&&b.data.blobs[0]&&b.data.blobs[0].url
    if(burl&&bannerImg) bannerImg.src = burl
    const imgs = Array.from(document.querySelectorAll('.profile-card .profile-img'))
    const plist = p&&p.ok&&p.data&&p.data.blobs||[]
    imgs.forEach((img,i)=>{ const u = plist[i]&&plist[i].url; if(u) img.src = u })
  }catch(_){/* */}
}

loadImages()
