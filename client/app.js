const form = document.getElementById('login-form')
const usernameEl = document.getElementById('username')
const passwordEl = document.getElementById('password')
const rememberEl = document.getElementById('remember')
const errorEl = document.getElementById('error')
const toggleBtn = document.getElementById('toggle-password')
const signupLink = document.getElementById('signup-link')

function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function isPhone(v){return /^\+?\d{6,15}$/.test(v)}
function validate(){
  const u = usernameEl.value.trim()
  const p = passwordEl.value
  if(!u) return '请输入账号'
  if(!(isEmail(u)||isPhone(u))) return '请输入有效的邮箱或手机号'
  if(!p) return '请输入密码'
  if(p.length<6) return '密码长度至少为 6 位'
  return ''
}

function setError(msg){errorEl.textContent = msg||''}

toggleBtn.addEventListener('click',()=>{
  if(passwordEl.type==='password'){passwordEl.type='text';toggleBtn.textContent='隐藏'}
  else{passwordEl.type='password';toggleBtn.textContent='显示'}
})

if(signupLink){signupLink.addEventListener('click',e=>{})}

const savedUser = null

form.addEventListener('submit',async e=>{
  e.preventDefault()
  setError('')
  const msg = validate()
  if(msg){setError(msg);return}
  const u = usernameEl.value.trim()
  const p = passwordEl.value
  if(rememberEl.checked){}
  try{
    console.log('[login] submitting to /api/auth/login')
    const r = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({account:u,password:p})})
    const j = await r.json()
    if(!j.ok){
      const e = String(j.error||'')
      let msg = e||'账号或密码错误'
      if(e.includes('supabase error 400')||/invalid/i.test(e)||/not\s*confirmed/i.test(e)){
        msg = '账号或密码错误或邮箱未验证'
      }
      setError(msg);return
    }
    location.href = 'dashboard.html'
  }catch(err){setError('登录失败，请稍后重试')}
})

{
  let lastActive = Date.now()
  const markActive = ()=>{lastActive=Date.now()}
  ;['click','keydown','mousemove','touchstart'].forEach(evt=>window.addEventListener(evt,markActive,{passive:true}))
  setInterval(async()=>{
    const idle = Date.now()-lastActive
    if(idle>10*60*1000){
      try{await fetch('/api/auth/logout',{method:'POST'})}catch(_){}
      location.href='index.html';
      return
    }
    try{await fetch('/api/auth/ping')}catch(_){}
  },60*1000)
}
