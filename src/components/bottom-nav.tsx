'use client'

import { useApp } from '@/lib/store'
import { Home, Compass, Calendar, GraduationCap, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BottomNav() {
  const { view, setView, user, openAuth } = useApp()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => {
      // Show after scrolling past hero on landing, always on other pages
      setVisible(window.scrollY > 300 || view !== 'landing')
    }
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [view])

  function go(v: any) {
    if ((v === 'profile' || v === 'booking') && !user) {
      openAuth('login')
      return
    }
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const items = [
    { icon: Home, label: 'Home', view: 'landing' },
    { icon: Compass, label: 'Explore', view: 'explore' },
    { icon: Calendar, label: 'Book', view: 'booking' },
    { icon: GraduationCap, label: 'Courses', view: 'courses' },
    { icon: User, label: 'Profile', view: 'profile' },
  ]

  if (!visible) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 bg-gradient-to-r from-background/80 via-background/80 to-primary/5">
        {items.map((item) => {
          const Icon = item.icon
          const active = view === item.view
          return (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className="flex flex-col items-center gap-1 px-2 py-1 min-w-[44px] min-h-[44px] justify-center"
            >
              <div className={`p-1.5 rounded-full transition-all ${active ? 'bg-gradient-to-br from-primary to-rose-500 shadow-md' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-[10px] font-medium ${active ? 'bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
