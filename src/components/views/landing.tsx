'use client'

import { useApp, apiFetch } from '@/lib/store'
import { salonImage } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Scissors, Sparkles, Calendar, ArrowRight, Star, Users, MapPin, Award, Heart, Check, ChevronRight } from 'lucide-react'
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
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Background image - brighter, with gradient fade to background at bottom */}
        <div className="absolute inset-0">
          <img src={salonImage('/salon/hero.png')} alt="Salon" className="w-full h-full object-cover" />
          {/* Lighter overlay so salon photo is visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </div>

        {/* Subtle aurora glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-fuchsia-500/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2.5s' }} />

        <div className="container mx-auto px-4 relative z-10 pt-8 pb-12 md:pt-20 md:pb-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex mb-5 md:mb-7"
            >
              <Badge className="glass-card border-primary/30 text-primary backdrop-blur px-4 py-1.5 text-[11px] md:text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span className="typewriter">PREMIUM SALON & BEAUTY ACADEMY</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-4 md:mb-6 tracking-tight"
            >
              Where <span className="shimmer-text">Style</span> Meets<br className="hidden sm:block" />
              <span className="text-brand-gradient"> Excellence</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-foreground/75 mb-8 md:mb-10 max-w-xl leading-relaxed"
            >
              Premium hair styling, bridal makeup, mehndi artistry & professional beauty courses at Pakistan's leading multi-branch salon.
            </motion.p>

            {/* CTAs - together with good spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10"
            >
              <Button
                size="lg"
                onClick={() => bookService()}
                className="bg-brand-gradient text-white hover:opacity-90 text-base px-8 h-13 rounded-full shadow-xl glow-soft btn-glow border-0 w-full sm:w-auto justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" /> Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView('explore')}
                className="text-base px-8 h-13 rounded-full glass-card border-primary/20 hover:border-primary/40 backdrop-blur w-full sm:w-auto justify-center"
              >
                Browse Styles <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-foreground/80">4.9</span>
              </div>
              <span className="text-border">•</span>
              <span>Trusted by 15,000+ clients</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-10 md:py-14 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-5 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-x-8"
          >
            {[
              { icon: Users, label: 'Happy Clients', value: '15K+' },
              { icon: Scissors, label: 'Expert Stylists', value: '20+' },
              { icon: Award, label: 'Years', value: '10+' },
              { icon: MapPin, label: 'Branches', value: '4' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md shrink-0">
                  <s.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl leading-none text-brand-gradient">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BRIDAL OFFER BANNER ===== */}
      <section className="relative py-3 bg-brand-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)25%,rgba(255,255,255,.1)50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)75%)] bg-[length:20px_20px] opacity-30" />
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-center relative z-10">
          <Sparkles className="w-5 h-5 text-white" />
          <p className="font-medium text-sm md:text-base text-white">
            🌸 Bridal Season Special: Complete Package (Makeup + Hair + Mehndi) from PKR 45,000
          </p>
          <Button size="sm" onClick={() => bookService()} className="rounded-full bg-white text-primary hover:bg-white/90 btn-glow">
            Book Now <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </section>

      {/* ===== MEN'S SERVICES ===== */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="For Gentlemen" title="Men's Services" subtitle="Sharp cuts, premium grooming, and modern styling by expert barbers" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {maleServices.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.1} onBook={() => bookService(s.id)} />)}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ===== WOMEN'S SERVICES ===== */}
      <section className="py-24 relative">
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-500/5 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="For Ladies" title="Women's Services" subtitle="From bridal transformations to everyday glamour — we've got you covered" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {femaleServices.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.1} onBook={() => bookService(s.id)} />)}
          </div>
        </div>
      </section>

      {/* ===== TRANSFORMATION SHOWCASE ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Gallery" title="Recent Transformations" subtitle="See the magic created by our talented stylists" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {['/salon/post-1.png', '/salon/post-2.png', '/salon/post-3.png', '/salon/post-4.png', '/salon/womens-bridal.png', '/salon/mehndi.png', '/salon/womens-color.png', '/salon/mens-haircut.png'].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative"
                onClick={() => setView('explore')}
              >
                <img src={salonImage(img)} alt="Transformation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 text-white">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-medium">View Style</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" onClick={() => setView('explore')} className="rounded-full glass-card border-primary/20 hover:border-primary/40 px-8">
              View All Styles <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="Why Choose Us" title="The Chohan's Experience" subtitle="Premium service, expert stylists, and a luxurious atmosphere" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {[
              { icon: Award, title: 'Expert Stylists', desc: 'Our team of 20+ professional stylists brings years of experience and continuous training.' },
              { icon: Sparkles, title: 'Premium Products', desc: 'We use only top-quality, imported products for hair, skin, and makeup services.' },
              { icon: Heart, title: 'Customer Love', desc: 'Over 15,000 satisfied customers with an average rating of 4.9 stars across all branches.' },
              { icon: MapPin, title: 'Multiple Branches', desc: '4 convenient locations across Lahore and Rawalpindi, with more coming soon.' },
              { icon: Calendar, title: 'Easy Booking', desc: 'Book your appointment 24/7 with our simple online system. No phone calls needed.' },
              { icon: Check, title: 'Hygiene First', desc: 'Strict cleanliness protocols, sanitized tools, and a safe environment for every client.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ===== COURSES PREVIEW ===== */}
      <section className="py-24 relative">
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="Beauty Academy" title="Professional Courses" subtitle="Turn your passion into a career with our certified beauty courses" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { title: 'Bridal Makeup', duration: '6 Weeks', fee: 'PKR 45,000', img: salonImage('/salon/course.png') },
              { title: 'Hair Styling Mastery', duration: '8 Weeks', fee: 'PKR 55,000', img: salonImage('/salon/womens-color.png') },
              { title: 'Mehndi Art', duration: '4 Weeks', fee: 'PKR 18,000', img: salonImage('/salon/mehndi.png') },
              { title: 'Barbering', duration: '5 Weeks', fee: 'PKR 30,000', img: salonImage('/salon/mens-haircut.png') },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden glass-card border-border/30 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group h-full" onClick={() => setView('courses')}>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-2 right-2 bg-brand-gradient text-white border-0">{c.duration}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{c.title}</h3>
                    <p className="text-sm text-brand-gradient font-medium">{c.fee}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={() => setView('courses')} className="bg-brand-gradient text-white rounded-full px-8 btn-glow border-0">
              Explore All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ===== BRANCHES PREVIEW ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Find Us" title="Our Branches" subtitle="Visit any of our premium locations across Pakistan" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {branches.slice(0, 4).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden glass-card border-border/30 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer h-full group" onClick={() => setView('branches')}>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={b.image || '/salon/branch.png'} alt={b.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{b.name.split('–')[1]?.trim() || b.name}</h3>
                      {b.avgRating > 0 && (
                        <Badge className="gap-1 bg-brand-gradient text-white border-0 text-[10px]"><Star className="w-2.5 h-2.5 fill-white" /> {b.avgRating}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary" /> {b.address}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 aurora-bg opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="Reviews" title="What Our Clients Say" subtitle="Real experiences from our wonderful customers" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { name: 'Ayesha K.', text: 'Got my bridal makeup done here and it was absolutely perfect! Sana understood exactly what I wanted. Highly recommend!', rating: 5, role: 'Bridal Client' },
              { name: 'Hamza A.', text: 'Best barber in Lahore hands down. Ali gives the cleanest fades. The atmosphere is premium and staff is professional.', rating: 5, role: 'Regular Customer' },
              { name: 'Fatima N.', text: "Completed the mehndi course and now I'm working professionally. The instructors are so supportive and skilled!", rating: 5, role: 'Course Graduate' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 mb-5 italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold shadow-md">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 aurora-bg opacity-40" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-6xl font-bold mb-5 text-white">
              Ready for Your<br />Transformation?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Book your appointment today and experience the Chohan's difference. Your style journey starts here.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" onClick={() => bookService()} className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 rounded-full btn-glow">
                <Calendar className="w-5 h-5 mr-2" /> Book Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView('courses')} className="text-base px-8 h-12 rounded-full border-white/50 text-white hover:bg-white/10 backdrop-blur">
                View Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
        <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-[10px] tracking-widest uppercase font-semibold">{badge}</Badge>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </motion.div>
  )
}

function ServiceCard({ service, delay, onBook }: { service: any; delay: number; onBook: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="glass-card rounded-2xl overflow-hidden group h-full hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="aspect-square relative overflow-hidden">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <Badge className="absolute top-2 right-2 bg-brand-gradient text-white border-0 text-[10px]">{service.category}</Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-semibold text-sm md:text-base drop-shadow-lg">{service.name}</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8 leading-relaxed">{service.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Starting from</p>
              <span className="font-bold text-brand-gradient text-sm">PKR {service.price.toLocaleString()}</span>
            </div>
            <Button size="sm" onClick={onBook} className="bg-brand-gradient text-white h-7 text-xs rounded-full px-3 btn-glow border-0">
              Book <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
