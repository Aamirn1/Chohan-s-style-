'use client'

import { useState, useRef, useEffect } from 'react'
import { apiFetch } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, X, Bot, Sparkles } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

export function AIChatPanel({ onClose }: { onClose?: () => void }) {
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

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    const userMsg: Msg = { role: 'user', content }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I couldn\'t respond right now. Please try WhatsApp instead!' }])
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
    <div className="flex flex-col h-[70vh] max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-4 flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm flex items-center gap-1">Style Assistant AI <Sparkles className="w-3 h-3" /></p>
          <p className="text-xs text-white/80">Online • Ask me anything</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll bg-gradient-to-b from-background to-muted/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.role === 'user'
                ? 'bg-gradient-to-br from-primary to-rose-500 text-white rounded-br-sm'
                : 'bg-card border border-border rounded-bl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground text-center">Quick questions:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full text-left text-xs bg-card hover:bg-muted border border-border rounded-lg px-3 py-2 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your message..."
            className="rounded-full"
            disabled={loading}
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon" className="rounded-full bg-gradient-to-br from-primary to-rose-500 text-white shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
