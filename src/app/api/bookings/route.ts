import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const bookings = await db.booking.findMany({
    where: { userId: user.id },
    include: { branch: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ bookings })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { branchId, serviceId, stylistId, date, time, notes } = await req.json()
  if (!branchId || !serviceId || !date || !time) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const service = await db.service.findUnique({ where: { id: serviceId } })
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  const booking = await db.booking.create({
    data: { userId: user.id, branchId, serviceId, stylistId, date, time, notes, price: service.price, status: 'CONFIRMED' },
    include: { branch: true, service: true },
  })
  await db.notification.create({ data: { userId: user.id, type: 'BOOKING', message: `Booking confirmed at ${booking.branch.name} on ${date} at ${time}` } })
  return NextResponse.json({ booking })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const booking = await db.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.userId !== user.id && !['ADMIN', 'OWNER', 'MANAGER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const updated = await db.booking.update({ where: { id }, data: { status } })
  return NextResponse.json({ booking: updated })
}
