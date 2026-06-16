import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId, text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Comment required' }, { status: 400 })
  // sanitize basic
  const clean = text.slice(0, 500).replace(/<[^>]*>/g, '')
  const comment = await db.comment.create({
    data: { postId, userId: user.id, text: clean },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  })
  const post = await db.post.findUnique({ where: { id: postId }, select: { authorId: true } })
  if (post && post.authorId !== user.id) {
    await db.notification.create({ data: { userId: post.authorId, type: 'COMMENT', message: `${user.name} commented on your post` } })
  }
  return NextResponse.json({ comment })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
  const comments = await db.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ comments })
}
