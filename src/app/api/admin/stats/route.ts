import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [users, posts, bookings, branches, reviews, courses, revenue] = await Promise.all([
    db.user.count(),
    db.post.count(),
    db.booking.count(),
    db.branch.count(),
    db.review.count(),
    db.course.count(),
    db.booking.aggregate({ _sum: { price: true }, where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
  ])

  // Branch KPIs
  const branchStats = await Promise.all(
    (await db.branch.findMany()).map(async (b) => {
      const [bk, rv, comp, rev] = await Promise.all([
        db.booking.count({ where: { branchId: b.id } }),
        db.review.findMany({ where: { branchId: b.id }, select: { serviceRating: true, staffRating: true, cleanlinessRating: true } }),
        db.booking.count({ where: { branchId: b.id, status: 'COMPLETED' } }),
        db.booking.aggregate({ _sum: { price: true }, where: { branchId: b.id, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
      ])
      const avg = rv.length ? rv.reduce((s, r) => s + (r.serviceRating + r.staffRating + r.cleanlinessRating) / 3, 0) / rv.length : 0
      return { id: b.id, name: b.name, city: b.city, bookings: bk, completed: comp, revenue: rev._sum.price || 0, avgRating: Math.round(avg * 10) / 10, reviewCount: rv.length }
    })
  )

  // Weekly trend (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const recentBookings = await db.booking.findMany({ where: { createdAt: { gte: weekAgo } }, select: { createdAt: true, price: true } })
  const trend: { date: string; bookings: number; revenue: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const ds = d.toISOString().split('T')[0]
    const dayItems = recentBookings.filter((b) => b.createdAt.toISOString().split('T')[0] === ds)
    trend.push({ date: ds, bookings: dayItems.length, revenue: dayItems.reduce((s, b) => s + b.price, 0) })
  }

  return NextResponse.json({
    totals: { users, posts, bookings, branches, reviews, courses, revenue: revenue._sum.price || 0 },
    branchStats,
    trend,
  })
}
