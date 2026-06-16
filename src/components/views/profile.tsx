'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard } from '@/components/post-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Heart, MessageCircle, UserPlus, Edit, LogOut, Star } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatDate } from '@/lib/time'

export function ProfileView() {
  const { user, logout, setView } = useApp()
  const [profile, setProfile] = useState<any>(user)
  const [posts, setPosts] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      apiFetch('/api/explore?limit=50').then((d) => setPosts(d.posts.filter((p: any) => p.author.id === user.id))),
      apiFetch('/api/bookings').then((d) => setBookings(d.bookings)),
    ]).finally(() => setLoading(false))
  }, [user])

  async function saveProfile(data: any) {
    try {
      // Update via auth/me or a dedicated endpoint - simplified for demo
      useApp.setState({ user: { ...user, ...data } })
      toast.success('Profile updated')
      setEditOpen(false)
    } catch (e: any) { toast.error(e.message) }
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-3xl">
      {/* Profile header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-brand-gradient" />
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col sm:flex-row gap-4 -mt-10">
            <Avatar className="w-24 h-24 border-4 border-background rounded-full">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:pt-10">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            </div>
            <div className="flex gap-2 sm:pt-10">
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
              <Button size="sm" variant="outline" onClick={() => { logout(); setView('landing') }}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>
          {user.bio && <p className="text-sm mt-4">{user.bio}</p>}
          <div className="flex gap-6 mt-4">
            <div><p className="font-bold">{posts.length}</p><p className="text-xs text-muted-foreground">Posts</p></div>
            <div><p className="font-bold">{bookings.length}</p><p className="text-xs text-muted-foreground">Bookings</p></div>
            <div><p className="font-bold">{following ? '12' : '0'}</p><p className="text-xs text-muted-foreground">Following</p></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts"><Heart className="w-4 h-4 mr-1" /> Posts</TabsTrigger>
          <TabsTrigger value="bookings"><Calendar className="w-4 h-4 mr-1" /> Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">{[1, 2].map((i) => <Skeleton key={i} className="aspect-square" />)}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts yet</p>
              <Button onClick={() => setView('feed')} className="bg-brand-gradient text-white">Create your first post</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {posts.map((p) => (
                <div key={p.id} className="aspect-square rounded-lg overflow-hidden group cursor-pointer relative">
                  <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {p._count.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {p._count.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="bookings" className="mt-4 space-y-3">
          {loading ? <Skeleton className="h-20" /> : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No bookings yet</p>
              <Button onClick={() => setView('booking')} className="bg-brand-gradient text-white">Book an appointment</Button>
            </div>
          ) : bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <img src={b.service.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{b.service.name}</p>
                  <p className="text-xs text-muted-foreground">{b.branch.name}</p>
                  <p className="text-xs text-muted-foreground">{b.date} at {b.time}</p>
                </div>
                <Badge variant={b.status === 'CONFIRMED' ? 'default' : b.status === 'COMPLETED' ? 'secondary' : 'outline'} className={b.status === 'CONFIRMED' ? 'bg-green-500' : ''}>{b.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} user={user} onSave={saveProfile} />
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
