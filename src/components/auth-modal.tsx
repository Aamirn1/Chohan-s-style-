'use client'

import { useState } from 'react'
import { useApp, apiFetch } from '@/lib/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Scissors, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'

export function AuthModal() {
  const { authModalOpen, authMode, closeAuth, setAuth, setView } = useApp()
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>, mode: 'login' | 'signup') {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body: any = { email: fd.get('email'), password: fd.get('password') }
    if (mode === 'signup') {
      body.name = fd.get('name')
      body.phone = fd.get('phone')
      body.gender = fd.get('gender')
    }
    try {
      const res = await apiFetch(`/api/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setAuth(res.token, res.user)
      closeAuth()
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
      if (res.user.role === 'ADMIN' || res.user.role === 'OWNER') {
        setView(res.user.role === 'OWNER' ? 'owner' : 'admin')
      } else {
        setView('feed')
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogContent className="sm:max-w-md bg-card border-border/40">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg glow-soft">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold logo-gold">Chohan's Style Hub</span>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {authMode === 'login' ? 'Sign in to book appointments and join our community' : 'Join our community of style enthusiasts'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={authMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="login" onClick={() => useApp.setState({ authMode: 'login' })} className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={() => useApp.setState({ authMode: 'signup' })} className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={(e) => submit(e, 'login')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9" required />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand-gradient text-white hover:opacity-90 btn-glow border-0">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-xs text-center text-muted-foreground glass-card rounded-lg p-3">
                <p className="font-semibold mb-1 text-primary">Demo Accounts</p>
                <p>Customer: demo@chohans.com / demo123</p>
                <p>Owner: owner@chohans.com / owner123</p>
                <p>Admin: admin@chohans.com / admin123</p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={(e) => submit(e, 'signup')} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="Your name" className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" name="phone" placeholder="+92300..." className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9" required />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand-gradient text-white hover:opacity-90 btn-glow border-0">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
