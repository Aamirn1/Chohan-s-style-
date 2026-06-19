'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Heart, MessageCircle, Edit, LogOut, Star, MessageCircle as WhatsApp, Sparkles, ChevronRight, Phone, Mail, MapPin, Clock, User, Award, CheckCircle2, CalendarCheck, Scissors } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AIChatPanel } from '@/components/ai-chat-panel'
import { toast } from 'sonner'
import { formatDate, formatTime } from '@/lib/time'

export function ProfileView() {
  const { user, logout, setView } = useApp()
  const [posts, setPosts] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      apiFetch('/api/explore?limit=50').then((d) => setPosts(d.posts.filter((p: any) => p.author.id === user.id))),
      apiFetch('/api/bookings').then((d) => setBookings(d.bookings)),
    ]).finally(() => setLoading(false))
  }, [user])

  async function saveProfile(data: any) {
    try {
      useApp.setState({ user: { ...user, ...data } })
      toast.success('Profile updated')
      setEditOpen(false)
    } catch (e: any) { toast.error(e.message) }
  }

  if (!user) return null

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING')
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED')
  const canPost = ['ADMIN', 'OWNER'].includes(user.role)

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-3xl">
      {/* ===== Profile Header ===== */}
      <Card className="mb-6 overflow-hidden border-0 shadow-lg">
        <div className="h-36 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 relative">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,white,transparent_40%)]" />
        </div>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col sm:flex-row gap-4 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-background rounded-full">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl bg-brand-gradient text-white">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:pt-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                <Badge className="bg-brand-gradient text-white border-0">{user.role}</Badge>
              </div>
              {user.bio && <p className="text-sm text-foreground/80 mt-1">{user.bio}</p>}
            </div>
            <div className="flex gap-2 sm:pt-8">
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)} className="border-primary/30 hover:bg-primary/5"><Edit className="w-4 h-4 mr-1" /> Edit</Button>
              <Button size="sm" variant="outline" onClick={() => { logout(); setView('landing') }}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* User details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground/80 truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{user.phone}</span>
              </div>
            )}
            {user.gender && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{user.gender}</span>
              </div>
            )}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground/80">Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 p-3 bg-gradient-to-r from-primary/5 to-rose-500/5 rounded-xl">
            <div><p className="font-bold text-lg bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">{posts.length}</p><p className="text-xs text-muted-foreground">Posts</p></div>
            <div><p className="font-bold text-lg bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">{bookings.length}</p><p className="text-xs text-muted-foreground">Bookings</p></div>
            <div><p className="font-bold text-lg bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">{completedBookings.length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Quick Actions ===== */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button onClick={() => setView('booking')} className="bg-brand-gradient text-white h-14 rounded-xl btn-glow border-0">
          <Calendar className="w-5 h-5 mr-2" /> Book Appointment
        </Button>
        <Button onClick={() => setView('bookings')} variant="outline" className="h-14 rounded-xl glass-card border-primary/20">
          <CalendarCheck className="w-5 h-5 mr-2" /> My Bookings
        </Button>
      </div>

      {/* ===== Tabs: Posts + Appointments ===== */}
      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-primary/5 to-rose-500/5">
          <TabsTrigger value="appointments" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><Calendar className="w-4 h-4 mr-1" /> Appointments</TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><Heart className="w-4 h-4 mr-1" /> Posts</TabsTrigger>
        </TabsList>

        {/* Appointments tab */}
        <TabsContent value="appointments" className="mt-4 space-y-3">
          {loading ? (
            <Skeleton className="h-20" />
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No appointments yet</p>
              <Button onClick={() => setView('booking')} className="bg-brand-gradient text-white">Book your first appointment</Button>
            </div>
          ) : (
            <>
              {/* Upcoming */}
              {upcomingBookings.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Upcoming ({upcomingBookings.length})</p>
                  {upcomingBookings.map((b) => (
                    <Card key={b.id} className="mb-2 border-border/50 glass-card">
                      <CardContent className="p-3 flex items-center gap-3">
                        <img src={b.service.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{b.service.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.branch.name.split('–')[1]?.trim() || b.branch.name}</p>
                          <p className="text-xs text-foreground/70 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.date)} at {formatTime(b.time)}</p>
                        </div>
                        <Badge className={b.status === 'CONFIRMED' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0' : 'bg-amber-500/20 text-amber-400 border-0'}>{b.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {/* Completed */}
              {completedBookings.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> History ({completedBookings.length})</p>
                  {completedBookings.map((b) => (
                    <Card key={b.id} className="mb-2 border-border/50 opacity-80">
                      <CardContent className="p-3 flex items-center gap-3">
                        <img src={b.service.image} alt="" className="w-12 h-12 rounded-lg object-cover grayscale" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{b.service.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(b.date)} • PKR {b.price.toLocaleString()}</p>
                        </div>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">{b.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Posts tab */}
        <TabsContent value="posts" className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">{[1, 2].map((i) => <Skeleton key={i} className="aspect-square" />)}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl">
              {canPost ? (
                <>
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No posts yet</p>
                  <Button onClick={() => setView('explore')} className="bg-brand-gradient text-white">Go to Explore to post</Button>
                </>
              ) : (
                <>
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">You can view, like & comment on posts</p>
                  <p className="text-xs text-muted-foreground mb-4">Only admins can upload to Explore</p>
                  <Button onClick={() => setView('explore')} className="bg-brand-gradient text-white">Browse Explore</Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {posts.map((p) => (
                <div key={p.id} className="aspect-square rounded-lg overflow-hidden group cursor-pointer relative">
                  <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {p._count.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {p._count.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== Quick Help & Support (below posts) ===== */}
      <div className="mt-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 text-center">Quick Help & Support</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* AI Assistant - amber/orange gradient background */}
          <button
            onClick={() => setChatOpen(true)}
            className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/20 border border-amber-500/30 hover:border-amber-500/50 hover:shadow-lg transition-all hover:-translate-y-0.5 text-left backdrop-blur"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-amber-100">AI Style Assistant</p>
              <p className="text-xs text-amber-200/70">Ask about styles, bookings & more</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition shrink-0" />
          </button>

          {/* WhatsApp - green gradient background */}
          <a
            href="https://wa.me/923205719979?text=Hi! I'd like to know more about Chohan's Style Hub services."
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 border border-green-500/30 hover:border-green-500/50 hover:shadow-lg transition-all hover:-translate-y-0.5 backdrop-blur"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <WhatsApp className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-green-100">WhatsApp Us</p>
              <p className="text-xs text-green-200/70">+92 320 5719979</p>
            </div>
            <ChevronRight className="w-4 h-4 text-green-300 group-hover:translate-x-1 transition shrink-0" />
          </a>
        </div>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} user={user} onSave={saveProfile} />

      {/* AI Assistant Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          <AIChatPanel onClose={() => setChatOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EditProfileDialog({ open, onOpenChange, user, onSave }: any) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || '')
  const [phone, setPhone] = useState(user.phone || '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
          <Button onClick={() => onSave({ name, bio, phone })} className="w-full bg-brand-gradient text-white">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
