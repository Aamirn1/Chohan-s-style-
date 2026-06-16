import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  const where: any = {}
  if (city) where.city = city
  const branches = await db.branch.findMany({
    where,
    include: {
      _count: { select: { reviews: true, bookings: true } },
      reviews: { select: { serviceRating: true, staffRating: true, cleanlinessRating: true } },
    },
  })
  const withRatings = branches.map((b) => {
    const avg = b.reviews.length
      ? b.reviews.reduce((s, r) => s + (r.serviceRating + r.staffRating + r.cleanlinessRating) / 3, 0) / b.reviews.length
      : 0
    const { reviews, ...rest } = b
    return { ...rest, avgRating: Math.round(avg * 10) / 10, reviewCount: b._count.reviews }
  })
  return NextResponse.json({ branches: withRatings })
}
