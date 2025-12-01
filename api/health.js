export default async function handler(req, res) {
  try {
    const info = {
      ok: true,
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasSupabaseKey: Boolean(process.env.SUPABASE_ANON_KEY),
      hasRedisUrl: Boolean(process.env.REDIS_URL),
      time: new Date().toISOString(),
    }
    res.status(200).json(info)
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) })
  }
}

