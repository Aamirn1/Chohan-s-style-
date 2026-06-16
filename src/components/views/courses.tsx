'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GraduationCap, Clock, MapPin, Check, Star, Users, Award } from 'lucide-react'
import { toast } from 'sonner'

export function CoursesView() {
  const { user, openAuth } = useApp()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    apiFetch('/api/courses').then((d) => setCourses(d.courses)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function enroll(course: any) {
    if (!user) { openAuth('login'); return }
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ type: 'COURSE', courseId: course.id, branchId: course.branchId, date: new Date().toISOString().split('T')[0], time: '10:00', notes: `Course: ${course.title}` }),
      })
      toast.success('Enrolled! We will contact you with course details.')
      setSelected(null)
    } catch (e: any) { toast.error(e.message) }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="text-center mb-8">
        <Badge className="mb-3 bg-primary/10 text-primary"><GraduationCap className="w-3 h-3 mr-1" /> Beauty Academy</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Professional Beauty Courses</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Turn your passion into a rewarding career with our certified courses taught by industry experts.</p>
      </div>

      {/* Success stories banner */}
      <div className="bg-brand-gradient rounded-2xl p-6 text-white mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl md:text-3xl font-bold">500+</p><p className="text-xs md:text-sm text-white/80">Graduates</p></div>
          <div><p className="text-2xl md:text-3xl font-bold">95%</p><p className="text-xs md:text-sm text-white/80">Employment Rate</p></div>
          <div><p className="text-2xl md:text-3xl font-bold">12+</p><p className="text-xs md:text-sm text-white/80">Countries</p></div>
        </div>
        <p className="text-center mt-3 text-sm text-white/90">Our alumni are working as professional stylists across Pakistan, UAE, UK, and Canada</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
            <div className="aspect-video relative">
              <img src={c.image || '/salon/course.png'} alt={c.title} className="w-full h-full object-cover" />
              <Badge className="absolute top-2 right-2 bg-brand-gradient text-white">{c.duration}</Badge>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <h3 className="font-display font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{c.description}</p>
              {c.instructor && <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Users className="w-3 h-3" /> Instructor: {c.instructor}</p>}
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-primary text-lg">PKR {c.fee.toLocaleString()}</span>
                {c.branch && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.branch.area}</span>}
              </div>
              <Button onClick={() => setSelected(c)} className="w-full bg-brand-gradient text-white">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img src={selected.image || '/salon/course.png'} alt={selected.title} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> <span>{selected.duration}</span></div>
                <div className="flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> <span>Certified</span></div>
                {selected.instructor && <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> <span>{selected.instructor}</span></div>}
                {selected.branch && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> <span>{selected.branch.name}</span></div>}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Course Fee</p>
                <p className="text-2xl font-bold text-primary">PKR {selected.fee.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Includes training materials & kit</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">What's included:</p>
                {['Professional training kit', 'Certificate of completion', 'Job placement assistance', 'Lifetime alumni network access'].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> {b}</div>
                ))}
              </div>
              <Button onClick={() => enroll(selected)} className="w-full bg-brand-gradient text-white">Enroll Now</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
