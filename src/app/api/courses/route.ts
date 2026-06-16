import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const courses = await db.course.findMany({ include: { branch: true, _count: { select: { enrollments: true } } } })
  return NextResponse.json({ courses })
}
