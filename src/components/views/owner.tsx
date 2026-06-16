'use client'

import { useEffect, useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Crown, TrendingUp, TrendingDown, DollarSign, Star, Users, Calendar, Download, Award, AlertCircle } from 'lucide-react'

export function OwnerView() {
  const { user, setView } = useApp()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/admin/stats').then((d) => setStats(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function exportCSV() {
    if (!stats) return
    const rows = stats.branchStats.map((b: any) => [b.name, b.city, b.bookings, b.completed, b.revenue, b.avgRating, b.reviewCount])
    const csv = ['Branch,City,Bookings,Completed,Revenue,Rating,Reviews', ...rows.map((r: any) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'branch-analytics.csv'; a.click()
  }

  if (loading) return <div className="container mx-auto px-4 py-6"><Skeleton className="h-96" /></div>
  if (!user || user.role !== 'OWNER') {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Owner access only.</p><Button onClick={() => setView('landing')} className="mt-4">Go Home</Button></div>
  }

  const sorted = [...stats.branchStats].sort((a, b) => b.revenue - a.revenue)
  const top = sorted[0]
  const low = sorted[sorted.length - 1]
  const totalRevenue = stats.branchStats.reduce((s: number, b: any) => s + b.revenue, 0)
  const avgRating = stats.branchStats.reduce((s: number, b: any) => s + b.avgRating, 0) / stats.branchStats.length

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Owner Dashboard</h1>
            <p className="text-xs text-muted-foreground">High-level business analytics</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={DollarSign} label="Total Revenue" value={`PKR ${(totalRevenue / 1000).toFixed(0)}K`} trend="+12%" up />
        <KpiCard icon={Calendar} label="Total Bookings" value={stats.totals.bookings} trend="+8%" up />
        <KpiCard icon={Users} label="Total Users" value={stats.totals.users} trend="+15%" up />
        <KpiCard icon={Star} label="Avg Rating" value={avgRating.toFixed(1)} trend="+0.2" up />
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-green-700">Top Performing Branch</p>
            </div>
            <p className="text-xl font-bold">{top?.name}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Revenue: <strong>PKR {top?.revenue.toLocaleString()}</strong></span>
              <span>Bookings: <strong>{top?.bookings}</strong></span>
              <span>Rating: <strong>{top?.avgRating}★</strong></span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="font-semibold text-amber-700">Needs Attention</p>
            </div>
            <p className="text-xl font-bold">{low?.name}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Revenue: <strong>PKR {low?.revenue.toLocaleString()}</strong></span>
              <span>Bookings: <strong>{low?.bookings}</strong></span>
              <span>Rating: <strong>{low?.avgRating}★</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue trend */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">7-Day Revenue & Bookings Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-48">
            {stats.trend.map((t: any, i: number) => {
              const maxRev = Math.max(...stats.trend.map((x: any) => x.revenue), 1)
              const h = (t.revenue / maxRev) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold">{(t.revenue / 1000).toFixed(0)}K</span>
                  <div className="w-full bg-gradient-to-t from-primary to-rose-400 rounded-t" style={{ height: `${h}%`, minHeight: '4px' }} />
                  <span className="text-xs text-muted-foreground">{t.bookings} bk</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(t.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Branch KPI table */}
      <Card>
        <CardHeader><CardTitle className="text-base">All Branches KPI</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Branch</th>
                  <th className="py-2 px-4">City</th>
                  <th className="py-2 px-4">Bookings</th>
                  <th className="py-2 px-4">Completed</th>
                  <th className="py-2 px-4">Revenue</th>
                  <th className="py-2 px-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b, i) => (
                  <tr key={b.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {i === 0 && <Crown className="w-4 h-4 text-amber-500" />}
                        <span className="font-medium">{b.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{b.city}</td>
                    <td className="py-3 px-4">{b.bookings}</td>
                    <td className="py-3 px-4">{b.completed}</td>
                    <td className="py-3 px-4 font-semibold">PKR {b.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{b.avgRating} <span className="text-xs text-muted-foreground">({b.reviewCount})</span></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, trend, up }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <Badge variant="secondary" className={up ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}>
            {up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{trend}
          </Badge>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
