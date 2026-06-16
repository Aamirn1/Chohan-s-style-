'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/time'

export function BranchesView() {
  const { setView, setBookingPrefill } = useApp()
  const [branches, setBranches] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [cityFilter, setCityFilter] = useState('ALL')

  useEffect(() => {
    apiFetch('/api/branches').then((d) => setBranches(d.branches)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cities = ['ALL', ...Array.from(new Set(branches.map((b) => b.city)))]
  const filtered = cityFilter === 'ALL' ? branches : branches.filter((b) => b.city === cityFilter)

  async function viewBranch(b: any) {
    setSelected(b)
    const d = await apiFetch(`/api/reviews?branchId=${b.id}`)
    setReviews(d.reviews)
  }

  function bookHere(b: any) {
    setBookingPrefill({ branchId: b.id })
    setView('booking')
    setSelected(null)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="text-center mb-6">
        <Badge className="mb-3 bg-primary/10 text-primary"><MapPin className="w-3 h-3 mr-1" /> Find Us</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Our Branches</h1>
        <p className="text-muted-foreground">Visit any of our premium locations</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 justify-center mb-6 flex-wrap">
        {cities.map((c) => (
          <Button key={c} size="sm" variant={cityFilter === c ? 'default' : 'outline'} onClick={() => setCityFilter(c)} className={cityFilter === c ? 'bg-brand-gradient text-white' : ''}>
            {c === 'ALL' ? 'All Cities' : c}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((b) => (
          <Card key={b.id} className="overflow-hidden hover:shadow-lg transition">
            <div className="aspect-video relative bg-brand-gradient-soft">
              <img src={b.image || '/salon/branch.png'} alt={b.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                <Badge className="bg-white/90 text-primary">{b.city}</Badge>
                {b.avgRating > 0 && <Badge className="bg-white/90 text-primary gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {b.avgRating} ({b.reviewCount})</Badge>}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-display font-semibold text-lg mb-2">{b.name.split('–')[1]?.trim() || b.name}</h3>
              <p className="text-sm text-muted-foreground flex items-start gap-1 mb-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {b.address}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {b.phone}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.openTime}-{b.closeTime}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => viewBranch(b)} className="flex-1">Details</Button>
                <Button size="sm" onClick={() => bookHere(b)} className="flex-1 bg-brand-gradient text-white">Book Here</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto custom-scroll">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              <img src={selected.image || '/salon/branch.png'} alt={selected.name} className="w-full h-40 object-cover rounded-lg" />
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> {selected.address}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {selected.phone}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Open daily {selected.openTime} - {selected.closeTime}</p>
                {selected.lat && selected.lng && (
                  <a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <Navigation className="w-4 h-4" /> Open in Google Maps
                  </a>
                )}
                <div className="pt-3 border-t">
                  <h4 className="font-semibold mb-2">Reviews ({reviews.length})</h4>
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scroll">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-6 h-6"><AvatarImage src={r.user.avatar} /><AvatarFallback>{r.user.name[0]}</AvatarFallback></Avatar>
                            <p className="font-semibold text-xs">{r.user.name}</p>
                            <span className="text-xs text-muted-foreground ml-auto">{formatDate(r.createdAt)}</span>
                          </div>
                          <div className="flex gap-2 text-xs mb-1">
                            <span>Service: {r.serviceRating}★</span>
                            <span>Staff: {r.staffRating}★</span>
                            <span>Clean: {r.cleanlinessRating}★</span>
                          </div>
                          {r.comment && <p className="text-sm">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={() => bookHere(selected)} className="w-full bg-brand-gradient text-white">Book Appointment Here</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
