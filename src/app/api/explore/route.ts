import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Explore: all posts with pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const category = searchParams.get('category')
  const where: any = {}
  if (category && category !== 'ALL') where.category = category
  const posts = await db.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, avatar: true, role: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
  return NextResponse.json({ posts, hasMore: posts.length === limit })
}
