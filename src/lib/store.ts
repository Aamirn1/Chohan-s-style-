'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewKey =
  | 'landing'
  | 'feed'
  | 'booking'
  | 'courses'
  | 'branches'
  | 'profile'
  | 'bookings'
  | 'notifications'
  | 'admin'
  | 'owner'
  | 'explore'

interface AppState {
  view: ViewKey
  setView: (v: ViewKey) => void
  // auth
  token: string | null
  user: any | null
  setAuth: (token: string, user: any) => void
  logout: () => void
  // misc
  authModalOpen: boolean
  authMode: 'login' | 'signup'
  openAuth: (mode?: 'login' | 'signup') => void
  closeAuth: () => void
  // booking prefill
  bookingPrefill: { serviceId?: string; branchId?: string } | null
  setBookingPrefill: (p: { serviceId?: string; branchId?: string } | null) => void
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      view: 'landing',
      setView: (v) => set({ view: v }),
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null, view: 'landing' }),
      authModalOpen: false,
      authMode: 'login',
      openAuth: (mode = 'login') => set({ authModalOpen: true, authMode: mode }),
      closeAuth: () => set({ authModalOpen: false }),
      bookingPrefill: null,
      setBookingPrefill: (p) => set({ bookingPrefill: p }),
    }),
    {
      name: 'chohans-app',
      partialize: (s) => ({ token: s.token, user: s.user, view: s.view }),
    }
  )
)

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = useApp.getState().token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) {
    const txt = await res.text()
    let msg = txt
    try {
      msg = JSON.parse(txt).error || txt
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}
