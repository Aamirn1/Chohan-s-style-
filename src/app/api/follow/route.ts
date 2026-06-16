import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { followingId } = await req.json()
  if (followingId === user.id) return NextResponse.json({ error: 'Cannot follow self' }, { status: 400 })
  const existing = await db.follow.findUnique({ where: { followerId_followingId: { followerId: user.id, followingId } } })
  if (existing) {
    await db.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ following: false })
  }
  await db.follow.create({ data: { followerId: user.id, followingId } })
  await db.notification.create({ data: { userId: followingId, type: 'FOLLOW', message: `${user.name} started following you` } })
  return NextResponse.json({ following: true })
}
