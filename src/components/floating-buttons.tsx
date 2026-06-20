'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!showScrollTop) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-4 z-30 w-9 h-9 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-4 h-4 text-primary" />
    </button>
  )
}
