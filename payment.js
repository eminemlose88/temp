function id(){return Math.random().toString(36).slice(2,10)}
function now(){const d=new Date();return d.toISOString()}
function read(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
function addDeposit(rec){const arr=read('deposit_records');arr.unshift(rec);write('deposit_records',arr)}
function addWithdraw(rec){const arr=read('withdraw_records');arr.unshift(rec);write('withdraw_records',arr)}
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
  form.addEventListener('submit',e=>{
    e.preventDefault();err.textContent=''
    const method=document.querySelector('input[name="pay"]:checked').value
    const amount=parseInt(document.getElementById('amount').value,10)
    if(!amount||amount<1000){err.textContent='请输入不低于 1000 的金额';return}
    const rec={id:id(),time:now(),amount,method,status:'Pending'}
    addDeposit(rec)
    setTimeout(()=>{rec.status='Completed';addDeposit(rec);renderRecentDeposits(recent);alert('入金成功：'+money(amount)+' KRW')},800)
  })
}

function renderRecentDeposits(container){
  const arr=read('deposit_records').slice(0,5)
  container.innerHTML=''
  arr.forEach(r=>{
    const line=document.createElement('div')
    line.className='menu-item'
    line.textContent=`#${r.id} · ${money(r.amount)} KRW · ${r.method.toUpperCase()} · ${r.status}`
    container.append(line)
  })
}

function initWithdrawPage(){
  const form=document.getElementById('withdraw-form')
  const err=document.getElementById('withdraw-error')
  form.addEventListener('submit',e=>{
    e.preventDefault();err.textContent=''
    const amount=parseInt(document.getElementById('wd-amount').value,10)
    const bank=document.getElementById('bank-name').value.trim()
    const holder=document.getElementById('bank-holder').value.trim()
    const account=document.getElementById('bank-account').value.trim()
    if(!amount||amount<1000){err.textContent='请输入不低于 1000 的金额';return}
    if(!bank||!holder||!account){err.textContent='请完整填写银行信息';return}
    const rec={id:id(),time:now(),amount,method:'bank',detail:{bank,holder,account},status:'Reviewing'}
    addWithdraw(rec)
    setTimeout(()=>{rec.status='Completed';addWithdraw(rec);alert('出金申请已完成：'+money(amount)+' KRW')},1000)
  })
}

function initRecordsPage(){
  const btnD=document.getElementById('btn-deposits')
  const btnW=document.getElementById('btn-withdraws')
  const list=document.getElementById('list')
  function renderDeposits(){
    btnD.classList.add('active');btnW.classList.remove('active')
    list.innerHTML=''
    read('deposit_records').forEach(r=>{
      const item=document.createElement('div');item.className='menu-item'
      item.textContent=`[入金] #${r.id} · ${money(r.amount)} KRW · ${r.method.toUpperCase()} · ${new Date(r.time).toLocaleString()} · ${r.status}`
      list.append(item)
    })
  }
  function renderWithdraws(){
    btnW.classList.add('active');btnD.classList.remove('active')
    list.innerHTML=''
    read('withdraw_records').forEach(r=>{
      const item=document.createElement('div');item.className='menu-item'
      item.textContent=`[出金] #${r.id} · ${money(r.amount)} KRW · ${r.detail.bank} · ${new Date(r.time).toLocaleString()} · ${r.status}`
      list.append(item)
    })
  }
  btnD.addEventListener('click',renderDeposits)
  btnW.addEventListener('click',renderWithdraws)
  renderDeposits()
}

