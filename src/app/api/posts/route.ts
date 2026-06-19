import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET feed (posts from followed users + own)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  let where: any = {}
  if (user) {
    const following = await db.follow.findMany({ where: { followerId: user.id }, select: { followingId: true } })
    const followingIds = following.map((f) => f.followingId)
    followingIds.push(user.id)
    // If not following anyone, show all posts (explore-like)
    if (followingIds.length > 1) {
      where = { authorId: { in: followingIds } }
    }
  }

  const posts = await db.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, avatar: true, role: true } },
      _count: { select: { likes: true, comments: true } },
      likes: user ? { where: { userId: user.id }, select: { id: true } } : false,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })

  const formatted = posts.map((p) => ({
    ...p,
    liked: p.likes ? p.likes.length > 0 : false,
    likes: undefined,
  }))

  return NextResponse.json({ posts: formatted, hasMore: posts.length === limit })
}

// CREATE post - only ADMIN and OWNER can upload
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Only administrators can upload posts. You can like, comment, and share posts in Explore.' }, { status: 403 })
  }
  const { image, caption, category } = await req.json()
  if (!image) return NextResponse.json({ error: 'Image required' }, { status: 400 })
  const post = await db.post.create({
    data: { image, caption, category: category || 'HAIRSTYLE', authorId: user.id },
    include: { author: { select: { id: true, name: true, avatar: true, role: true } }, _count: { select: { likes: true, comments: true } } },
  })
  return NextResponse.json({ post })
}

// DELETE post
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const post = await db.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.authorId !== user.id && !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await db.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
