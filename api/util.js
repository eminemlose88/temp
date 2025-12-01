import { kv } from '@vercel/kv'

export function ok(res, data){res.status(200).json({ok:true,data})}
export function bad(res, msg){res.status(400).json({ok:false,error:msg})}
export function unauthorized(res){res.status(401).json({ok:false,error:'unauthorized'})}
export function getAuth(req){return (req.headers['authorization']||'').replace('Bearer ','')}
export function requireAdmin(req,res){const key=getAuth(req);if(!key||key!==process.env.ADMIN_API_KEY){unauthorized(res);return false}return true}
export { kv }

