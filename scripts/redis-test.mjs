import { createClient } from 'redis'

async function main() {
  const client = createClient({ url: process.env.REDIS_URL })
    .on('error', (err) => console.error('Redis Client Error', err))
  await client.connect()
  await client.set('foo', 'bar')
  const result = await client.get('foo')
  console.log(result)
  await client.quit()
}

main().catch((e) => { console.error(e); process.exit(1) })
