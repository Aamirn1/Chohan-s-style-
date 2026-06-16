'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, MapPin, Star, Check, X, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate, formatTime } from '@/lib/time'

export function BookingsView() {
  const { user } = useApp()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewFor, setReviewFor] = useState<any | null>(null)

  useEffect(() => { load() }, [])
  async function load() {
    setLoading(true)
    try { const d = await apiFetch('/api/bookings'); setBookings(d.bookings) } catch {} finally { setLoading(false) }
  }

  async function cancel(id: string) {
    try {
      await apiFetch('/api/bookings', { method: 'PATCH', body: JSON.stringify({ id, status: 'CANCELLED' }) })
      toast.success('Booking cancelled')
      load()
    } catch (e: any) { toast.error(e.message) }
  }

  async function submitReview(data: any) {
    try {
      await apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify({ branchId: reviewFor.branchId, bookingId: reviewFor.id, ...data }) })
      toast.success('Review submitted!')
      setReviewFor(null)
    } catch (e: any) { toast.error(e.message) }
  }

  if (loading) return <div className="container mx-auto px-4 py-6 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-brand-gradient-soft mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">No bookings yet</h2>
          <p className="text-muted-foreground mb-6">Book your first appointment today!</p>
          <Button onClick={() => useApp.getState().setView('booking')} className="bg-brand-gradient text-white">Book Now</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img src={b.service.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{b.service.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.branch.name}</p>
                      </div>
                      <Badge variant={b.status === 'CONFIRMED' ? 'default' : b.status === 'COMPLETED' ? 'secondary' : b.status === 'CANCELLED' ? 'destructive' : 'outline'}
                        className={b.status === 'CONFIRMED' ? 'bg-green-500' : ''}>{b.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(b.time)}</span>
                      <span className="font-semibold text-primary">PKR {b.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {b.status === 'CONFIRMED' && (
                        <Button size="sm" variant="outline" onClick={() => cancel(b.id)} className="text-destructive h-7 text-xs">
                          <X className="w-3 h-3 mr-1" /> Cancel
                        </Button>
                      )}
                      {b.status === 'COMPLETED' && (
                        <Button size="sm" onClick={() => setReviewFor(b)} className="bg-brand-gradient text-white h-7 text-xs">
                          <Star className="w-3 h-3 mr-1" /> Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReviewDialog booking={reviewFor} onClose={() => setReviewFor(null)} onSubmit={submitReview} />
    </div>
  )
}

function ReviewDialog({ booking, onClose, onSubmit }: any) {
  const [serviceRating, setServiceRating] = useState(5)
  const [staffRating, setStaffRating] = useState(5)
  const [cleanlinessRating, setCleanlinessRating] = useState(5)
  const [comment, setComment] = useState('')

  if (!booking) return null

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Leave a Review</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">How was your experience at {booking.branch.name}?</p>
          <RatingRow label="Service Quality" value={serviceRating} onChange={setServiceRating} />
          <RatingRow label="Staff Behavior" value={staffRating} onChange={setStaffRating} />
          <RatingRow label="Cleanliness" value={cleanlinessRating} onChange={setCleanlinessRating} />
          <div><Label>Comment (optional)</Label><Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={3} /></div>
          <Button onClick={() => onSubmit({ serviceRating, staffRating, cleanlinessRating, comment })} className="w-full bg-brand-gradient text-white">Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RatingRow({ label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)}><Star className={`w-6 h-6 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} /></button>
        ))}
      </div>
    </div>
  )
}
