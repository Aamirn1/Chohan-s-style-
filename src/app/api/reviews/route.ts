import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const branchId = searchParams.get('branchId')
  const where: any = {}
  if (branchId) where.branchId = branchId
  const reviews = await db.review.findMany({
    where,
    include: { user: { select: { id: true, name: true, avatar: true } }, branch: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ reviews })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { branchId, bookingId, serviceRating, staffRating, cleanlinessRating, comment } = await req.json()
  if (!branchId) return NextResponse.json({ error: 'Branch required' }, { status: 400 })
  const clean = (comment || '').slice(0, 1000).replace(/<[^>]*>/g, '')
  const review = await db.review.create({
    data: {
      userId: user.id,
      branchId,
      bookingId,
      serviceRating: Math.min(5, Math.max(1, serviceRating || 5)),
      staffRating: Math.min(5, Math.max(1, staffRating || 5)),
      cleanlinessRating: Math.min(5, Math.max(1, cleanlinessRating || 5)),
      comment: clean,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  })
  return NextResponse.json({ review })
}
