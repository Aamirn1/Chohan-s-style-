import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  const unread = await db.notification.count({ where: { userId: user.id, read: false } })
  return NextResponse.json({ notifications, unread })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } })
  return NextResponse.json({ ok: true })
}
