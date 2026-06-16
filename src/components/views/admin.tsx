'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Calendar, DollarSign, Star, Flag, TrendingUp, Image as ImageIcon, Store, Check, X, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/time'
import { toast } from 'sonner'

export function AdminView() {
  const { user, setView } = useApp()
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch('/api/admin/stats').then((d) => setStats(d)).catch(() => {}),
      apiFetch('/api/admin/users').then((d) => setUsers(d.users)).catch(() => {}),
      apiFetch('/api/admin/reports').then((d) => setReports(d.reports)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  async function changeRole(id: string, role: string) {
    try {
      await apiFetch('/api/admin/users', { method: 'PATCH', body: JSON.stringify({ id, role }) })
      toast.success('Role updated')
      setUsers((u) => u.map((x) => x.id === id ? { ...x, role } : x))
    } catch (e: any) { toast.error(e.message) }
  }

  async function handleReport(id: string, action: string) {
    try {
      await apiFetch('/api/admin/reports', { method: 'PATCH', body: JSON.stringify({ id, action }) })
      toast.success(action === 'DELETE_POST' ? 'Post deleted' : 'Report resolved')
      setReports((r) => r.filter((x) => x.id !== id))
    } catch (e: any) { toast.error(e.message) }
  }

  if (loading) return <div className="container mx-auto px-4 py-6"><Skeleton className="h-96" /></div>
  if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Access denied. Admin only.</p><Button onClick={() => setView('landing')} className="mt-4">Go Home</Button></div>
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary" className="ml-auto">{user.role}</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total Users" value={stats?.totals.users} color="from-blue-400 to-blue-600" />
            <StatCard icon={Calendar} label="Bookings" value={stats?.totals.bookings} color="from-emerald-400 to-emerald-600" />
            <StatCard icon={DollarSign} label="Revenue" value={`PKR ${(stats?.totals.revenue / 1000).toFixed(0)}K`} color="from-amber-400 to-orange-600" />
            <StatCard icon={ImageIcon} label="Posts" value={stats?.totals.posts} color="from-rose-400 to-pink-600" />
          </div>

          {/* Trend chart */}
          <Card>
            <CardHeader><CardTitle className="text-base">Weekly Booking Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-40">
                {stats?.trend.map((t: any, i: number) => {
                  const max = Math.max(...stats.trend.map((x: any) => x.bookings), 1)
                  const h = (t.bookings / max) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">{t.bookings}</span>
                      <div className="w-full bg-brand-gradient rounded-t" style={{ height: `${h}%`, minHeight: '4px' }} />
                      <span className="text-[10px] text-muted-foreground">{new Date(t.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Branch performance */}
          <Card>
            <CardHeader><CardTitle className="text-base">Branch Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.branchStats.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.city}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center"><p className="font-bold">{b.bookings}</p><p className="text-xs text-muted-foreground">Bookings</p></div>
                      <div className="text-center"><p className="font-bold">PKR {(b.revenue / 1000).toFixed(0)}K</p><p className="text-xs text-muted-foreground">Revenue</p></div>
                      <div className="text-center"><p className="font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{b.avgRating}</p><p className="text-xs text-muted-foreground">{b.reviewCount} reviews</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-3">
          <Card>
            <CardHeader><CardTitle>User Management ({users.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scroll">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="w-10 h-10"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      <p className="text-xs text-muted-foreground">{u._count.posts} posts • {u._count.bookings} bookings</p>
                    </div>
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="text-xs border rounded px-2 py-1 bg-background">
                      <option value="CUSTOMER">Customer</option>
                      <option value="STYLIST">Stylist</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-3">
          <Card>
            <CardHeader><CardTitle>Reported Content ({reports.length})</CardTitle></CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No reports pending</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scroll">
                  {reports.map((r) => (
                    <div key={r.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <img src={r.post.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Reported by {r.reporter.name}</p>
                        <p className="text-xs text-muted-foreground">Post by {r.post.author.name}</p>
                        <p className="text-xs mt-1">{r.reason}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="destructive" onClick={() => handleReport(r.id, 'DELETE_POST')} className="h-7 text-xs"><Trash2 className="w-3 h-3 mr-1" /> Delete Post</Button>
                          <Button size="sm" variant="outline" onClick={() => handleReport(r.id, 'DISMISS')} className="h-7 text-xs"><X className="w-3 h-3 mr-1" /> Dismiss</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches */}
        <TabsContent value="branches" className="space-y-3">
          <Card>
            <CardHeader><CardTitle>Branches Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats?.branchStats.map((b: any) => (
                  <div key={b.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{b.name}</p>
                      <Badge variant="secondary">{b.city}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><p className="text-xs text-muted-foreground">Bookings</p><p className="font-bold">{b.bookings}</p></div>
                      <div><p className="text-xs text-muted-foreground">Completed</p><p className="font-bold">{b.completed}</p></div>
                      <div><p className="text-xs text-muted-foreground">Revenue</p><p className="font-bold">PKR {b.revenue.toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Rating</p><p className="font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{b.avgRating}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold">{value ?? 0}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
