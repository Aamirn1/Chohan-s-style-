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
  const { view, token, openAuth, user } = useApp()

  // Seed on first load
  useEffect(() => {
    fetch('/api/seed').catch(() => {})
  }, [])

  // Guard views that need auth
  useEffect(() => {
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
  }, [view, token, user])

  const isAdminView = view === 'admin' || view === 'owner'

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
