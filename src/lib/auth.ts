import { db } from '@/lib/db'

// Match the simpleHash from seed.ts
export function hashPassword(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return `seed_${h}_${s.length}`
}

export function verifyPassword(plain: string, hash: string) {
  return hashPassword(plain) === hash
}

export async function ensureSeed() {
  const { ensureSeed: seed } = await import('@/lib/seed')
  await seed()
}

export async function getCurrentUser(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  // token format: userId (simplified for demo)
  try {
    const user = await db.user.findUnique({ where: { id: token }, include: { branch: true } })
    return user
  } catch {
    return null
  }
}

export function makeToken(userId: string) {
  return userId // simplified token for demo
}
