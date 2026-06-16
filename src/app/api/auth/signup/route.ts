import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, makeToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, gender } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashPassword(password),
        name,
        phone,
        gender,
        role: 'CUSTOMER',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      },
      include: { branch: true },
    })
    const { password: _, ...safe } = user
    return NextResponse.json({ token: makeToken(user.id), user: safe })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
