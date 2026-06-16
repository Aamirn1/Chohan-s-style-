import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, avatar: true, createdAt: true, _count: { select: { posts: true, bookings: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id, role } = await req.json()
  if (!['CUSTOMER', 'STYLIST', 'MANAGER', 'ADMIN'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  await db.user.update({ where: { id }, data: { role } })
  return NextResponse.json({ ok: true })
}
