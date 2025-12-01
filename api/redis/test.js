import { createClient } from 'redis'

export default async function handler(req, res) {
  try {
    const client = createClient({ url: process.env.REDIS_URL })
      .on('error', (err) => console.error('Redis Client Error', err))
    await client.connect()
    await client.set('foo', 'bar')
    const result = await client.get('foo')
    await client.quit()
    res.status(200).json({ ok: true, result })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) })
  }
}
