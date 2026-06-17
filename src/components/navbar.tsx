'use client'

import { useApp } from '@/lib/store'
import { Scissors, Menu, X, LogOut, LayoutDashboard, Crown } from 'lucide-react'
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
    { label: 'Home', view: 'landing' as const, public: true },
    { label: 'Explore', view: 'explore' as const, public: true },
    { label: 'Book Now', view: 'booking' as const, public: false },
    { label: 'Courses', view: 'courses' as const, public: true },
    { label: 'Branches', view: 'branches' as const, public: true },
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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass-card border-b border-border/40 shadow-lg' : 'bg-transparent'}`}>
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
            <SheetContent side="right" className="w-72 bg-card border-border/40">
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shadow-md">
                    <Scissors className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold logo-gold">Chohan's Style Hub</span>
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => go(item.view)}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition ${
                      view === item.view ? 'bg-brand-gradient text-white' : 'hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {user && (
                  <>
                    <button onClick={() => go('feed')} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition ${view === 'feed' ? 'bg-brand-gradient text-white' : 'hover:bg-muted'}`}>
                      My Feed
                    </button>
                    <button onClick={() => go('bookings')} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition ${view === 'bookings' ? 'bg-brand-gradient text-white' : 'hover:bg-muted'}`}>
                      My Bookings
                    </button>
                    <button onClick={() => go('profile')} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition ${view === 'profile' ? 'bg-brand-gradient text-white' : 'hover:bg-muted'}`}>
                      Profile
                    </button>
                    {user.role === 'OWNER' && (
                      <button onClick={() => go('owner')} className="px-4 py-3 rounded-xl text-left text-sm font-medium transition hover:bg-muted flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500" /> Owner Dashboard
                      </button>
                    )}
                    {(user.role === 'ADMIN' || user.role === 'OWNER') && (
                      <button onClick={() => go('admin')} className="px-4 py-3 rounded-xl text-left text-sm font-medium transition hover:bg-muted flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </button>
                    )}
                    <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-left text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                )}
                {!user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button onClick={() => { openAuth('login'); setMobileOpen(false) }} variant="outline">Login</Button>
                    <Button onClick={() => { openAuth('signup'); setMobileOpen(false) }} className="bg-brand-gradient text-white">Sign Up</Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
