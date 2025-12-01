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

signupLink.addEventListener('click',e=>{e.preventDefault();alert('请联系管理员开通或稍后上线注册功能')})

const savedUser = localStorage.getItem('remember_user')
if(savedUser){usernameEl.value = savedUser;rememberEl.checked = true}

form.addEventListener('submit',async e=>{
  e.preventDefault()
  setError('')
  const msg = validate()
  if(msg){setError(msg);return}
  const u = usernameEl.value.trim()
  const p = passwordEl.value
  if(rememberEl.checked){localStorage.setItem('remember_user',u)} else {localStorage.removeItem('remember_user')}
  try{
    await new Promise(r=>setTimeout(r,600))
    const ok = (u==='admin@example.com'&&p==='123456')||(u==='+8613800138000'&&p==='123456')
    if(!ok){setError('账号或密码错误');return}
    localStorage.setItem('current_user',u)
    try{fetch('/api/users/connect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:u,name:u})}).catch(()=>{})}catch(_){ }
    location.href = 'dashboard.html'
  }catch(err){setError('登录失败，请稍后重试')}
})

