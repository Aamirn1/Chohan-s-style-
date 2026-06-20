'use client'

import { useApp } from '@/lib/store'
import { Scissors, Menu, X, LogOut, LayoutDashboard, Crown, Home, Compass, Calendar, GraduationCap, MapPin, User, Heart, CalendarCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'

export function Navbar() {
  const { user, view, setView, openAuth, logout } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navItems = [
    { label: 'Home', view: 'landing' as const, icon: Home },
    { label: 'Explore', view: 'explore' as const, icon: Compass },
    { label: 'Book Now', view: 'booking' as const, icon: Calendar },
    { label: 'Courses', view: 'courses' as const, icon: GraduationCap },
    { label: 'Branches', view: 'branches' as const, icon: MapPin },
  ]

  const userItems = [
    { label: 'My Feed', view: 'feed' as const, icon: Heart },
    { label: 'My Bookings', view: 'bookings' as const, icon: CalendarCheck },
    { label: 'Profile', view: 'profile' as const, icon: User },
  ]

  function go(v: any) {
    if (!user && (v === 'booking' || v === 'feed' || v === 'profile' || v === 'bookings')) {
      openAuth('login')
    } else {
      setView(v)
    }
    setMobileOpen(false)
    useApp.getState().closeAuth()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLogout() {
    logout()
    toast({ title: 'Logged out successfully' })
    setMobileOpen(false)
  }

  return (
    <header
      className={`sticky z-40 transition-all duration-300 ${scrolled ? 'glass-card border-b border-border/40 shadow-lg' : 'bg-transparent'}`}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => go('landing')} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform glow-soft">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold logo-gold hidden sm:inline">Chohan's Style Hub</span>
          <span className="font-display text-lg font-bold logo-gold sm:hidden">Chohan's</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === item.view
                  ? 'bg-brand-gradient text-white shadow-md glow-soft'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'OWNER' && (
                <Button variant="ghost" size="sm" onClick={() => go('owner')} className="hidden md:flex gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" /> Owner
                </Button>
              )}
              {(user.role === 'ADMIN' || user.role === 'OWNER') && (
                <Button variant="ghost" size="sm" onClick={() => go('admin')} className="hidden md:flex gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Button>
              )}
              <button onClick={() => go('profile')} className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition">
                <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
              </button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => openAuth('login')} className="hidden md:inline-flex text-foreground/80 hover:text-foreground">Login</Button>
              <Button size="sm" onClick={() => openAuth('signup')} className="bg-brand-gradient text-white hover:opacity-90 hidden md:inline-flex btn-glow border-0">Sign Up</Button>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-80 bg-card border-border/40 p-0" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              <div className="flex flex-col h-full">
                {/* Brand header */}
                <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-border/40 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg shrink-0">
                    <Scissors className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-bold logo-gold text-base block leading-tight">Chohan's Style Hub</span>
                    <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Premium Salon</span>
                  </div>
                </div>

                {/* Menu items - scrollable */}
                <div className="flex-1 overflow-y-auto custom-scroll px-3 py-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const active = view === item.view
                    return (
                      <button
                        key={item.view}
                        onClick={() => go(item.view)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? 'bg-brand-gradient text-white shadow-md'
                            : 'hover:bg-muted/60 text-foreground/90'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? 'bg-white/20' : 'bg-primary/15 border border-primary/25'
                        }`}>
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary'}`} />
                        </div>
                        {item.label}
                      </button>
                    )
                  })}

                  {/* User section divider */}
                  {user && (
                    <div className="pt-3 mt-3 border-t border-border/40">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">My Account</p>
                      {userItems.map((item) => {
                        const Icon = item.icon
                        const active = view === item.view
                        return (
                          <button
                            key={item.view}
                            onClick={() => go(item.view)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                              active ? 'bg-brand-gradient text-white shadow-md' : 'hover:bg-muted/60 text-foreground/90'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-white/20' : 'bg-primary/15 border border-primary/25'}`}>
                              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary'}`} />
                            </div>
                            {item.label}
                          </button>
                        )
                      })}

                      {/* Admin/Owner */}
                      {user.role === 'OWNER' && (
                        <button onClick={() => go('owner')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-muted/60 text-foreground/90 ${view === 'owner' ? 'bg-brand-gradient text-white shadow-md' : ''}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${view === 'owner' ? 'bg-white/20' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                            <Crown className={`w-4 h-4 ${view === 'owner' ? 'text-white' : 'text-amber-400'}`} />
                          </div>
                          Owner Dashboard
                        </button>
                      )}
                      {(user.role === 'ADMIN' || user.role === 'OWNER') && (
                        <button onClick={() => go('admin')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-muted/60 text-foreground/90 ${view === 'admin' ? 'bg-brand-gradient text-white shadow-md' : ''}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${view === 'admin' ? 'bg-white/20' : 'bg-primary/15 border border-primary/25'}`}>
                            <LayoutDashboard className={`w-4 h-4 ${view === 'admin' ? 'text-white' : 'text-primary'}`} />
                          </div>
                          Admin Panel
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer - Login/Signup or Logout */}
                <div className="px-3 py-4 border-t border-border/40 space-y-2 shrink-0">
                  {user ? (
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-destructive/20 border border-destructive/30">
                        <LogOut className="w-4 h-4 text-destructive" />
                      </div>
                      Logout
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => { openAuth('login'); setMobileOpen(false) }} variant="outline" className="flex-1 rounded-xl h-11">Login</Button>
                      <Button onClick={() => { openAuth('signup'); setMobileOpen(false) }} className="flex-1 rounded-xl h-11 bg-brand-gradient text-white btn-glow border-0">Sign Up</Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
