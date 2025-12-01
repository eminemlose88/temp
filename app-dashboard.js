const tabs = {
  home: document.getElementById('tab-home'),
  profiles: document.getElementById('tab-profiles'),
  events: document.getElementById('tab-events'),
  videos: document.getElementById('tab-videos'),
  mypage: document.getElementById('tab-mypage')
}
const navItems = Array.from(document.querySelectorAll('.nav-item'))

function switchTab(key){
  Object.values(tabs).forEach(el=>el.classList.remove('active'))
  tabs[key].classList.add('active')
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.tab===key))
  if(key==='events'){
    const loader=document.getElementById('events-loading')
    loader.style.opacity='1'
    setTimeout(()=>{loader.style.opacity='1'},300)
  }
}

navItems.forEach(n=>n.addEventListener('click',()=>switchTab(n.dataset.tab)))
Array.from(document.querySelectorAll('[data-goto]')).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();switchTab(a.dataset.goto)}))

const profiles=[
  {name:'Ava', region:'경기도', views:262626, score:9.6},
  {name:'Jian', region:'충청북도', views:151654, score:9.8},
  {name:'Mina', region:'서울', views:182044, score:9.5},
  {name:'Eun', region:'제주도', views:126220, score:9.7}
]

function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

function renderProfiles(){
  const grid=document.getElementById('profiles-grid')
  grid.innerHTML=''
  profiles.forEach(p=>{
    const card=el('div','profile-card')
    const img=el('div','profile-img')
    img.style.backgroundImage='url(assets/placeholder.svg)'
    img.style.backgroundSize='cover'
    img.style.backgroundPosition='center'
    const badge=el('div','badge','官方')
    const meta=el('div','p-meta')
    meta.appendChild(el('div','p-name',p.name))
    const rate=el('div','rate',`<span>❤</span><span>${p.score.toFixed(1)}</span>`) 
    meta.appendChild(rate)
    const loc=el('div','chip ghost',p.region)
    loc.style.position='absolute';loc.style.right='8px';loc.style.bottom='8px'
    const views=el('div','chip ghost',`👁 ${p.views}`)
    views.style.position='absolute';views.style.left='8px';views.style.bottom='8px'
    card.append(img,badge,meta,views,loc)
    grid.append(card)
  })
}

const videos=[
  {title:'健身基础课程', score:9.8},
  {title:'时尚走秀精选', score:9.7},
  {title:'旅拍景致合辑', score:9.5}
]

function renderVideos(){
  const list=document.getElementById('video-list')
  list.innerHTML=''
  videos.forEach(v=>{
    const item=el('div','video-item')
    const th=el('div','video-thumb')
    th.style.backgroundImage='url(assets/placeholder.svg)'
    th.style.backgroundSize='cover'
    th.style.backgroundPosition='center'
    const body=el('div','video-body')
    const tag=el('span','chip tag',`分数：${v.score.toFixed(1)}`)
    const title=el('div','p-name',v.title)
    body.append(tag,title)
    item.append(th,body)
    list.append(item)
  })
}

function initUser(){
  const name=localStorage.getItem('current_user')||'用户'
  const pname=document.getElementById('pname')
  const pid=document.getElementById('pid')
  if(pname)pname.textContent=name
  if(pid)pid.textContent='NO.'+String(Math.floor(Math.random()*1e7)).padStart(7,'0')
}

renderProfiles()
renderVideos()
initUser()
switchTab('home')

