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

function initUser(){
  const name=sessionStorage.getItem('current_user')||'用户'
  const pname=document.getElementById('pname')
  const pid=document.getElementById('pid')
  if(pname)pname.textContent=name
  if(pid)pid.textContent='NO.'+String(Math.floor(Math.random()*1e7)).padStart(7,'0')
}

initUser()
switchTab('home')
