'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Scissors, Check, ChevronRight, ChevronLeft, User } from 'lucide-react'
import { toast } from 'sonner'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

export function BookingView() {
  const { user, setView, bookingPrefill, setBookingPrefill } = useApp()
  const [step, setStep] = useState(1)
  const [branches, setBranches] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [stylists, setStylists] = useState<any[]>([])
  const [sel, setSel] = useState<{ branchId?: string; serviceId?: string; stylistId?: string; date?: string; time?: string; notes?: string }>(
    bookingPrefill?.serviceId ? { serviceId: bookingPrefill.serviceId } : {}
  )
  const [prefillApplied, setPrefillApplied] = useState(false)

  useEffect(() => {
    apiFetch('/api/branches').then((d) => setBranches(d.branches)).catch(() => {})
    apiFetch('/api/services').then((d) => setServices(d.services)).catch(() => {})
  }, [])

  // Clear prefill after mount so it doesn't re-apply
  useEffect(() => {
    if (bookingPrefill && !prefillApplied) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefillApplied(true)
      setBookingPrefill(null)
    }
  }, [bookingPrefill, prefillApplied, setBookingPrefill])

  const branchServices = services.filter((s) => !sel.branchId || true)
  const selectedBranch = branches.find((b) => b.id === sel.branchId)
  const selectedService = services.find((s) => s.id === sel.serviceId)
  const selectedStylist = stylists.find((s) => s.id === sel.stylistId)

  // get min date = today
  const today = new Date().toISOString().split('T')[0]

  async function confirm() {
    if (!sel.branchId || !sel.serviceId || !sel.date || !sel.time) {
      toast.error('Please complete all steps')
      return
    }
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          branchId: sel.branchId,
          serviceId: sel.serviceId,
          stylistId: sel.stylistId,
          date: sel.date,
          time: sel.time,
          notes: sel.notes,
        }),
      })
      toast.success('Booking confirmed! Check your bookings page.')
      setView('bookings')
    } catch (e: any) { toast.error(e.message) }
  }

  const steps = ['Service', 'Branch', 'Date & Time', 'Confirm']

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Book an Appointment</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-gradient text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? 'font-semibold' : 'text-muted-foreground'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap mb-4">
            {['ALL', 'MALE', 'FEMALE'].map((g) => (
              <Button key={g} size="sm" variant="outline" onClick={() => setSel((s) => ({ ...s, _gender: g }))}>
                {g === 'ALL' ? 'All' : g === 'MALE' ? "Men's" : "Women's"}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branchServices.map((s) => (
              <Card key={s.id} className={`cursor-pointer transition hover:shadow-md ${sel.serviceId === s.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSel((p) => ({ ...p, serviceId: s.id }))}>
                <CardContent className="p-4 flex gap-3">
                  <img src={s.image} alt={s.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px]">{s.gender}</Badge>
                      <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                    </div>
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-primary text-sm">PKR {s.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!sel.serviceId} className="bg-brand-gradient text-white">Next <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 2: Branch */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branches.map((b) => (
              <Card key={b.id} className={`cursor-pointer transition hover:shadow-md ${sel.branchId === b.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSel((p) => ({ ...p, branchId: b.id }))}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img src={b.image || '/salon/branch.png'} alt={b.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{b.name.split('–')[1]?.trim() || b.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {b.address}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {b.openTime} - {b.closeTime}
                        {b.avgRating > 0 && <Badge variant="secondary" className="text-[10px]">★ {b.avgRating}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4" /> Back</Button>
            <Button onClick={() => setStep(3)} disabled={!sel.branchId} className="bg-brand-gradient text-white">Next <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Input type="date" min={today} value={sel.date || ''} onChange={(e) => setSel((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button key={t} onClick={() => setSel((p) => ({ ...p, time: t }))} className={`py-2 rounded-lg text-sm font-medium transition ${
                      sel.time === t ? 'bg-brand-gradient text-white' : 'bg-muted hover:bg-muted/70'
                    }`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea value={sel.notes || ''} onChange={(e) => setSel((p) => ({ ...p, notes: e.target.value }))} placeholder="Any special requests..." rows={2} />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4" /> Back</Button>
            <Button onClick={() => setStep(4)} disabled={!sel.date || !sel.time} className="bg-brand-gradient text-white">Review <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Confirm Your Booking</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {selectedService && (
                <div className="flex gap-3 items-center p-3 bg-muted/50 rounded-lg">
                  <img src={selectedService.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold">{selectedService.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedService.category} • {selectedService.duration} min</p>
                    <p className="text-sm font-bold text-primary">PKR {selectedService.price.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {selectedBranch && (
                <div className="flex gap-3 items-center p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">{selectedBranch.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedBranch.address}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 items-center p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">{sel.date}</p>
                  <p className="text-xs text-muted-foreground">{sel.time}</p>
                </div>
              </div>
              {sel.notes && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{sel.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}><ChevronLeft className="w-4 h-4" /> Back</Button>
            <Button onClick={confirm} className="bg-brand-gradient text-white">Confirm Booking <Check className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
