'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/store'
import { LandingPage } from './views/landing'
import { FeedView } from './views/feed'
import { BookingView } from './views/booking'
import { CoursesView } from './views/courses'
import { BranchesView } from './views/branches'
import { ProfileView } from './views/profile'
import { BookingsView } from './views/bookings'
import { ExploreView } from './views/explore'
import { AdminView } from './views/admin'
import { OwnerView } from './views/owner'
import { Navbar } from './navbar'
import { BottomNav } from './bottom-nav'
import { AuthModal } from './auth-modal'
import { FloatingButtons } from './floating-buttons'
import { Footer } from './footer'

export function AppShell() {
  const { view, token, openAuth, user, _hasHydrated, setHasHydrated } = useApp()

  // Seed on first load
  useEffect(() => {
    fetch('/api/seed').catch(() => {})
  }, [])

  // Manual hydration check - more reliable than onRehydrateStorage
  useEffect(() => {
    if (!_hasHydrated) {
      // zustand persist rehydrates synchronously on client, so mark as hydrated
      setHasHydrated(true)
    }
  }, [_hasHydrated, setHasHydrated])

  // Guard views that need auth
  useEffect(() => {
    if (!_hasHydrated) return
    const needsAuth = ['feed', 'booking', 'profile', 'bookings', 'admin', 'owner', 'notifications', 'explore']
    if (needsAuth.includes(view) && !token) {
      openAuth('login')
    }
    // Guard admin/owner
    if ((view === 'admin' || view === 'owner') && user && !['ADMIN', 'OWNER'].includes(user.role)) {
      useApp.setState({ view: 'landing' })
    }
    if (view === 'owner' && user && user.role !== 'OWNER') {
      useApp.setState({ view: 'admin' })
    }
  }, [view, token, user, _hasHydrated])

  const isAdminView = view === 'admin' || view === 'owner'

  // Render nothing until hydrated to avoid hydration mismatch
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="h-16 border-b" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {view === 'landing' && <LandingPage />}
        {view === 'feed' && <FeedView />}
        {view === 'explore' && <ExploreView />}
        {view === 'booking' && <BookingView />}
        {view === 'courses' && <CoursesView />}
        {view === 'branches' && <BranchesView />}
        {view === 'profile' && <ProfileView />}
        {view === 'bookings' && <BookingsView />}
        {view === 'admin' && <AdminView />}
        {view === 'owner' && <OwnerView />}
      </main>
      {!isAdminView && <Footer />}
      {!isAdminView && <BottomNav />}
      <AuthModal />
      <FloatingButtons />
    </div>
  )
}
