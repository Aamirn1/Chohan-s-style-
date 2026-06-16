'use client'

import { useState, useRef, useEffect } from 'react'
import { apiFetch } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Send, X, Bot } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

export function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI style assistant 💇‍♀️ Ask me about hairstyles, services, bookings, or courses!' },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Msg = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I couldn\'t respond right now. Please try again or WhatsApp us!' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'Which hairstyle suits my face?',
    'What bridal packages do you offer?',
    'Tell me about your courses',
  ]

  return (
    <>
      {/* Floating AI button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 shadow-lg shadow-orange-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform animate-gentle-pulse"
          aria-label="AI Chat Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[60vh] max-h-[500px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/40">
          {/* Header */}
          <div className="bg-brand-gradient p-4 flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Style Assistant AI</p>
              <p className="text-xs text-white/80">Online • Ask me anything</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll bg-background/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-brand-gradient text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground text-center">Quick questions:</p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="block w-full text-left text-xs bg-muted/60 hover:bg-muted rounded-lg px-3 py-2 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-background/80">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type your message..."
                className="rounded-full"
                disabled={loading}
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="rounded-full bg-brand-gradient text-white shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
