import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const reports = await db.report.findMany({
    include: { post: { include: { author: { select: { name: true } } } }, reporter: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ reports })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id, action } = await req.json() // action: RESOLVE | DELETE_POST | DISMISS
  const report = await db.report.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (action === 'DELETE_POST') {
    await db.post.delete({ where: { id: report.postId } })
  } else {
    await db.report.update({ where: { id }, data: { status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED' } })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId, reason } = await req.json()
  await db.report.create({ data: { reporterId: user.id, postId, reason: reason?.slice(0, 500) || 'Inappropriate content' } })
  return NextResponse.json({ ok: true })
}
