function money(n){return new Intl.NumberFormat('ko-KR').format(n)}
function createRow(title,right,muted){const row=document.createElement('div');row.className='menu-item';const a=document.createElement('div');a.textContent=title;const b=document.createElement('div');b.textContent=right;b.style.float='right';b.style.color=muted?'var(--muted)':'var(--text)';row.append(a);row.append(b);return row}

function initDepositPage(){
  const radios=document.querySelectorAll('input[name="pay"]')
  const card=document.getElementById('card-fields')
  const kakao=document.getElementById('kakao-fields')
  radios.forEach(r=>r.addEventListener('change',()=>{const v=document.querySelector('input[name="pay"]:checked').value;card.style.display=v==='card'?'block':'none';kakao.style.display=v==='kakao'?'block':'none'}))
  const form=document.getElementById('deposit-form')
  const err=document.getElementById('deposit-error')
  const recent=document.getElementById('recent-deposits')
  renderRecentDeposits(recent)
  form.addEventListener('submit',async e=>{
    e.preventDefault();err.textContent=''
    const method=document.querySelector('input[name="pay"]:checked').value
    const amount=parseInt(document.getElementById('amount').value,10)
    if(!amount||amount<1000){err.textContent='请输入不低于 1000 的金额';return}
    const token=sessionStorage.getItem('auth_token')
    try{
      if(!token){err.textContent='请先登录';return}
      const r=await fetch('/api/tips/create',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({amount,method,currency:'KRW'})})
      const j=await r.json()
      if(j&&j.ok){alert('入金记录已创建');renderRecentDeposits(recent)} else { err.textContent=j.error||'创建失败' }
    }catch(e){ err.textContent='网络错误，请稍后重试' }
  })
}

async function renderRecentDeposits(container){
  container.innerHTML=''
  const token=sessionStorage.getItem('auth_token')
  if(!token){container.textContent='请登录后查看';return}
  try{
    const r=await fetch('/api/tips/my',{headers:{Authorization:'Bearer '+token}})
    const j=await r.json()
    const arr=(j&&j.ok&&j.data&&j.data.tips)||[]
    arr.slice(0,5).forEach(r=>{
      const line=document.createElement('div')
      line.className='menu-item'
      const when=r.createdAt?new Date(r.createdAt).toLocaleString():''
      line.textContent=`#${r.id} · ${money(r.amount)} KRW · ${(r.method||'').toString().toUpperCase()} · ${when} · ${r.status||''}`
      container.append(line)
    })
  }catch(_){container.textContent='加载失败'}
}

function initWithdrawPage(){
  const form=document.getElementById('withdraw-form')
  const err=document.getElementById('withdraw-error')
  form.addEventListener('submit',async e=>{
    e.preventDefault();err.textContent=''
    const amount=parseInt(document.getElementById('wd-amount').value,10)
    const bank=document.getElementById('bank-name').value.trim()
    const holder=document.getElementById('bank-holder').value.trim()
    const account=document.getElementById('bank-account').value.trim()
    if(!amount||amount<1000){err.textContent='请输入不低于 1000 的金额';return}
    if(!bank||!holder||!account){err.textContent='请完整填写银行信息';return}
    const token=sessionStorage.getItem('auth_token')
    if(!token){err.textContent='请先登录';return}
    try{
      const reference=JSON.stringify({bank,holder,account})
      const r=await fetch('/api/tips/create',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({amount,method:'bank',currency:'KRW',reference})})
      const j=await r.json()
      if(j&&j.ok){alert('出金申请已提交');} else {err.textContent=j.error||'提交失败'}
    }catch(_){err.textContent='网络错误，请稍后重试'}
  })
}

function initRecordsPage(){
  const btnD=document.getElementById('btn-deposits')
  const btnW=document.getElementById('btn-withdraws')
  const list=document.getElementById('list')
  async function renderDeposits(){
    btnD.classList.add('active');btnW.classList.remove('active')
    list.innerHTML=''
    const token=sessionStorage.getItem('auth_token')
    if(!token){list.textContent='请登录后查看';return}
    let items=[]
    try{const r=await fetch('/api/tips/my',{headers:{Authorization:'Bearer '+token}});const j=await r.json();if(j&&j.ok){items=j.data.tips||[]}}catch(_){items=[]}
    items.forEach(r=>{
      const item=document.createElement('div');item.className='menu-item'
      const when=r.createdAt?new Date(r.createdAt).toLocaleString():''
      item.textContent=`[入金] #${r.id} · ${money(r.amount)} KRW · ${(r.method||'').toString().toUpperCase()} · ${when} · ${r.status||''}`
      list.append(item)
    })
  }
  function renderWithdraws(){
    btnW.classList.add('active');btnD.classList.remove('active')
    list.innerHTML=''
    list.textContent='请通过入金记录查看提交历史'
  }
  btnD.addEventListener('click',renderDeposits)
  btnW.addEventListener('click',renderWithdraws)
  renderDeposits()
}
