import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ensureSeed } from '@/lib/seed'

export async function GET() {
  try {
    await ensureSeed()
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
