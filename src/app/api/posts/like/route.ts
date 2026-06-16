import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId } = await req.json()
  const existing = await db.like.findUnique({ where: { postId_userId: { postId, userId: user.id } } })
  if (existing) {
    await db.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }
  await db.like.create({ data: { postId, userId: user.id } })
  // notification
  const post = await db.post.findUnique({ where: { id: postId }, select: { authorId: true } })
  if (post && post.authorId !== user.id) {
    await db.notification.create({ data: { userId: post.authorId, type: 'LIKE', message: `${user.name} liked your post` } })
  }
  return NextResponse.json({ liked: true })
}
