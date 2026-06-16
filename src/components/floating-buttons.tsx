'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowUp } from 'lucide-react'
import { AIChat } from './ai-chat'

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* WhatsApp - bottom right */}
      <a
        href="https://wa.me/923205719979?text=Hi! I'd like to know more about Chohan's Style Hub services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-green-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </a>

      {/* AI Chat - positioned above WhatsApp */}
      <AIChat />

      {/* Scroll to top - bottom left */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full glass shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
