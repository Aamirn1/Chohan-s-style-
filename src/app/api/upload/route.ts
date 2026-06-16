import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Simple upload: accept base64, save to public/uploads
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { image, filename } = await req.json()
  if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 })
  // Validate it's an image base64
  if (!image.startsWith('data:image/')) return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
  // Limit ~5MB base64
  if (image.length > 7 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

  const matches = image.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  const buffer = Buffer.from(matches[2], 'base64')

  const { promises: fs } = await import('fs')
  const path = await import('path')
  const dir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(dir, { recursive: true })
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  await fs.writeFile(path.join(dir, name), buffer)
  return NextResponse.json({ url: `/uploads/${name}` })
}
