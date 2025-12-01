import crypto from 'node:crypto'
import { getRedis } from './redis.js'

export async function createSession(userIdOrPayload, ttlSec=60*10){
  const token = crypto.randomBytes(24).toString('base64url')
  const r = await getRedis()
  const payload = typeof userIdOrPayload === 'object' ? userIdOrPayload : { uid: String(userIdOrPayload) }
  await r.set(`session:${token}`, JSON.stringify(payload), { EX: ttlSec })
  return token
}

export async function getSessionUserId(req){
  const auth = req.headers['authorization']||''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if(!token) return null
  const r = await getRedis()
  const uid = await r.get(`session:${token}`)
  return uid
}

export async function getSessionUserId(req){
  const auth = req.headers['authorization']||''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
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
  const auth = req.headers['authorization']||''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if(!token) return null
  const r = await getRedis()
  const raw = await r.get(`session:${token}`)
  if(!raw) return null
  try{ return JSON.parse(raw) }catch{ return { uid: raw } }
}
  return true
}
