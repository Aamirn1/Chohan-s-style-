import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gender = searchParams.get('gender')
  const branchId = searchParams.get('branchId')
  const where: any = {}
  if (gender) where.gender = { in: [gender, 'BOTH'] }
  if (branchId) where.branches = { some: { branchId } }
  const services = await db.service.findMany({ where, orderBy: { category: 'asc' } })
  return NextResponse.json({ services })
}
