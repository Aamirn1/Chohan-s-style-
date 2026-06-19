'use client'

import { useState, useEffect } from 'react'

interface RotatingTypewriterProps {
  messages: string[]
  /** Typing speed (ms per character) */
  typeSpeed?: number
  /** Deleting speed (ms per character) */
  deleteSpeed?: number
  /** Hold time after fully typed (ms) */
  holdTime?: number
  /** Delay before first message starts (ms) */
  startDelay?: number
  className?: string
}

export function RotatingTypewriter({
  messages,
  typeSpeed = 55,
  deleteSpeed = 30,
  holdTime = 2000,
  startDelay = 500,
  className = '',
}: RotatingTypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting' | 'starting'>('starting')

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'starting') {
      timeout = setTimeout(() => setPhase('typing'), startDelay)
      return () => clearTimeout(timeout)
    }

    const current = messages[msgIndex]

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        // Type next character
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1))
        }, typeSpeed)
      } else {
        // Fully typed — hold
        timeout = setTimeout(() => setPhase('holding'), holdTime / 2)
      }
    } else if (phase === 'holding') {
      // Wait, then start deleting
      timeout = setTimeout(() => setPhase('deleting'), holdTime)
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        // Delete one character
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length - 1))
        }, deleteSpeed)
      } else {
        // Fully deleted — move to next message
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMsgIndex((i) => (i + 1) % messages.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout)
  }, [displayed, phase, msgIndex, messages, typeSpeed, deleteSpeed, holdTime, startDelay])

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  )
}
