import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, makeToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() }, include: { branch: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!verifyPassword(password, user.password)) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    const { password: _, ...safe } = user
    return NextResponse.json({ token: makeToken(user.id), user: safe })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
