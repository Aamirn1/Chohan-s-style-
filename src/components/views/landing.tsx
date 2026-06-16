'use client'

import { useApp, apiFetch } from '@/lib/store'
import { salonImage } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Scissors, Sparkles, Calendar, ArrowRight, Star, Users, MapPin, Award, Heart, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LandingPage() {
  const { user, setView, openAuth, setBookingPrefill } = useApp()
  const [services, setServices] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    apiFetch('/api/services').then((d) => setServices(d.services)).catch(() => {})
    apiFetch('/api/branches').then((d) => setBranches(d.branches)).catch(() => {})
  }, [])

  const maleServices = services.filter((s) => s.gender === 'MALE').slice(0, 4)
  const femaleServices = services.filter((s) => s.gender === 'FEMALE').slice(0, 4)

  function bookService(serviceId?: string) {
    if (!user) { openAuth('login'); return }
    if (serviceId) setBookingPrefill({ serviceId })
    setView('booking')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center">
        <div className="absolute inset-0 bg-brand-gradient-soft animate-gradient" />
        <div className="absolute inset-0 opacity-30">
          <img src={salonImage('/salon/hero.png')} alt="Chohan's Style Hub salon" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-white/70 text-primary border-0 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" /> Premium Salon & Beauty Academy
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4">
                Where <span className="shimmer-text">Style</span> Meets<br /> Excellence
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
                Experience premium hair styling, bridal makeup, mehndi artistry, and professional beauty courses at Chohan's Style Hub — Pakistan's leading multi-branch salon.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => bookService()} className="bg-brand-gradient text-white hover:opacity-90 text-base px-8 h-12 rounded-full shadow-lg">
                  <Calendar className="w-5 h-5 mr-2" /> Book Appointment
                </Button>
                <Button size="lg" variant="outline" onClick={() => setView('explore')} className="text-base px-8 h-12 rounded-full glass border-white/40">
                  Browse Styles <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 mt-10">
                {[
                  { icon: Users, label: 'Happy Clients', value: '15K+' },
                  { icon: Scissors, label: 'Expert Stylists', value: '20+' },
                  { icon: MapPin, label: 'Branches', value: '4' },
                  { icon: Award, label: 'Years Experience', value: '10+' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BRIDAL OFFER */}
      <section className="py-4 bg-brand-gradient text-white">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-center">
          <Sparkles className="w-5 h-5" />
          <p className="font-medium text-sm md:text-base">
            🌸 Bridal Season Special: Complete Bridal Package (Makeup + Hair + Mehndi) starting at PKR 45,000
          </p>
          <Button size="sm" variant="secondary" onClick={() => bookService()} className="rounded-full">Book Now <ArrowRight className="w-3 h-3 ml-1" /></Button>
        </div>
      </section>

      {/* MEN'S SERVICES */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader badge="For Gentlemen" title="Men's Services" subtitle="Sharp cuts, premium grooming, and modern styling by expert barbers" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {maleServices.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.1} onBook={() => bookService(s.id)} />)}
        </div>
      </section>

      {/* WOMEN'S SERVICES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader badge="For Ladies" title="Women's Services" subtitle="From bridal transformations to everyday glamour — we've got you covered" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {femaleServices.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.1} onBook={() => bookService(s.id)} />)}
          </div>
        </div>
      </section>

      {/* TRANSFORMATION SHOWCASE */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader badge="Gallery" title="Recent Transformations" subtitle="See the magic created by our talented stylists" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {['/salon/post-1.png', '/salon/post-2.png', '/salon/post-3.png', '/salon/post-4.png', '/salon/womens-bridal.png', '/salon/mehndi.png', '/salon/womens-color.png', '/salon/mens-haircut.png'].map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative" onClick={() => setView('explore')}>
              <img src={salonImage(img)} alt="Hairstyle transformation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={() => setView('explore')} className="rounded-full">View All Styles <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-brand-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Why Choose Us" title="The Chohan's Experience" subtitle="Premium service, expert stylists, and a luxurious atmosphere" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: Award, title: 'Expert Stylists', desc: 'Our team of 20+ professional stylists brings years of experience and continuous training.' },
              { icon: Sparkles, title: 'Premium Products', desc: 'We use only top-quality, imported products for hair, skin, and makeup services.' },
              { icon: Heart, title: 'Customer Love', desc: 'Over 15,000 satisfied customers with an average rating of 4.9 stars across all branches.' },
              { icon: MapPin, title: 'Multiple Branches', desc: '4 convenient locations across Lahore and Rawalpindi, with more coming soon.' },
              { icon: Calendar, title: 'Easy Booking', desc: 'Book your appointment 24/7 with our simple online system. No phone calls needed.' },
              { icon: Check, title: 'Hygiene First', desc: 'Strict cleanliness protocols, sanitized tools, and a safe environment for every client.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full glass border-white/40 hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader badge="Beauty Academy" title="Professional Courses" subtitle="Turn your passion into a career with our certified beauty courses" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { title: 'Bridal Makeup', duration: '6 Weeks', fee: 'PKR 45,000', img: salonImage('/salon/course.png') },
            { title: 'Hair Styling Mastery', duration: '8 Weeks', fee: 'PKR 55,000', img: salonImage('/salon/womens-color.png') },
            { title: 'Mehndi Art', duration: '4 Weeks', fee: 'PKR 18,000', img: salonImage('/salon/mehndi.png') },
            { title: 'Barbering', duration: '5 Weeks', fee: 'PKR 30,000', img: salonImage('/salon/mens-haircut.png') },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={() => setView('courses')}>
                <div className="aspect-video relative">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-brand-gradient text-white">{c.duration}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-primary font-medium">{c.fee}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button size="lg" onClick={() => setView('courses')} className="bg-brand-gradient text-white rounded-full px-8">Explore All Courses <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      {/* BRANCHES PREVIEW */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Find Us" title="Our Branches" subtitle="Visit any of our premium locations across Pakistan" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {branches.slice(0, 4).map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full" onClick={() => setView('branches')}>
                  <div className="aspect-video relative bg-brand-gradient-soft">
                    <img src={b.image || '/salon/branch.png'} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{b.name.split('–')[1]?.trim() || b.name}</h3>
                      {b.avgRating > 0 && (
                        <Badge variant="secondary" className="gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {b.avgRating}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-start gap-1"><MapPin className="w-3 h-3 mt-1 shrink-0" /> {b.address}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader badge="Reviews" title="What Our Clients Say" subtitle="Real experiences from our wonderful customers" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { name: 'Ayesha K.', text: 'Got my bridal makeup done here and it was absolutely perfect! Sana understood exactly what I wanted. Highly recommend!', rating: 5, role: 'Bridal Client' },
            { name: 'Hamza A.', text: 'Best barber in Lahore hands down. Ali gives the cleanest fades. The atmosphere is premium and staff is professional.', rating: 5, role: 'Regular Customer' },
            { name: 'Fatima N.', text: "Completed the mehndi course and now I'm working professionally. The instructors are so supportive and skilled!", rating: 5, role: 'Course Graduate' },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm text-foreground/80 mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready for Your Transformation?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Book your appointment today and experience the Chohan's difference. Your style journey starts here.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" onClick={() => bookService()} className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 rounded-full"><Calendar className="w-5 h-5 mr-2" /> Book Now</Button>
              <Button size="lg" variant="outline" onClick={() => setView('courses')} className="text-base px-8 h-12 rounded-full border-white text-white hover:bg-white/10">View Courses</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
      <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">{badge}</Badge>
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </motion.div>
  )
}

function ServiceCard({ service, delay, onBook }: { service: any; delay: number; onBook: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}>
      <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group h-full">
        <div className="aspect-square relative overflow-hidden">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-2 right-2 bg-brand-gradient text-white">{service.category}</Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-semibold text-sm md:text-base">{service.name}</p>
          </div>
        </div>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 h-8">{service.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">PKR {service.price.toLocaleString()}</span>
            <Button size="sm" onClick={onBook} className="bg-brand-gradient text-white h-7 text-xs rounded-full px-3">Book</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
