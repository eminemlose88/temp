import crypto from 'node:crypto'
import { getRedis } from './redis.js'

export async function createSession(userIdOrPayload, ttlSec=60*10){
  const token = crypto.randomBytes(24).toString('base64url')
  const r = await getRedis()
  const payload = typeof userIdOrPayload === 'object' ? userIdOrPayload : { uid: String(userIdOrPayload) }
  await r.set(`session:${token}`, JSON.stringify(payload), { EX: ttlSec })
  return token
}

function getAuthToken(req){
  const auth = req.headers['authorization']||''
  if(auth.startsWith('Bearer ')) return auth.slice(7)
  const cookie = req.headers['cookie']||''
  if(cookie){
    const parts = cookie.split(';').map(s=>s.trim())
    for(const p of parts){
      if(p.startsWith('auth_token=')) return p.slice('auth_token='.length)
    }
  }
  return ''
}

export function setSessionCookie(res, token, maxAgeSec){
  const age = Number(maxAgeSec||0)
  const cookie = `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; ${age>0?`Max-Age=${age}`:'Session'}`
  res.setHeader('Set-Cookie', cookie)
}

export function clearSessionCookie(res){
  res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
}

export async function getSessionUserId(req){
  const token = getAuthToken(req)
  if(!token) return null
  const r = await getRedis()
  const raw = await r.get(`session:${token}`)
  if(!raw) return null
  try{ const obj=JSON.parse(raw); return obj.uid||obj.userId||null }catch{ return raw }
}

export function requireAdmin(req,res){
  const key=(req.headers['authorization']||'').replace('Bearer ','')
  if(!key||key!==process.env.ADMIN_API_KEY){
    res.status(401).json({ok:false,error:'unauthorized'})
    return false
  }
  return true
}

export async function getSession(req){
  const token = getAuthToken(req)
  if(!token) return null
  const r = await getRedis()
  const raw = await r.get(`session:${token}`)
  if(!raw) return null
  try{ return JSON.parse(raw) }catch{ return { uid: raw } }
}

export async function touchSession(req, ttlSec=60*10){
  const token = getAuthToken(req)
  if(!token) return false
  const r = await getRedis()
  const key = `session:${token}`
  const raw = await r.get(key)
  if(!raw) return false
  await r.expire(key, ttlSec)
  return true
}
