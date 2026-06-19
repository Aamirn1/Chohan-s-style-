'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { PostCard } from '@/components/post-card'
import { NewPostButton } from '@/components/new-post-button'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Compass, Plus } from 'lucide-react'

export function FeedView() {
  const { user, setView } = useApp()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const load = useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setOffset(0) }
    else setLoadingMore(true)
    try {
      const d = await apiFetch(`/api/feed?limit=10&offset=${reset ? 0 : offset}`)
      setPosts((p) => reset ? d.posts : [...p, ...d.posts])
      setHasMore(d.hasMore)
      setOffset((o) => reset ? 10 : o + 10)
    } catch {} finally {
      setLoading(false); setLoadingMore(false)
    }
  }, [offset])

  useEffect(() => { load(true) }, [])

  function onDelete(id: string) {
    setPosts((p) => p.filter((x) => x.id !== id))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></div>
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    const canPost = user && ['ADMIN', 'OWNER'].includes(user.role)
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-brand-gradient-soft mx-auto flex items-center justify-center mb-4">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Your feed is empty</h2>
        <p className="text-muted-foreground mb-6">Follow stylists and other users to see their posts here, or explore all styles.</p>
        <div className="flex flex-col gap-2">
          <Button onClick={() => setView('explore')} className="bg-brand-gradient text-white">Explore Styles</Button>
          {canPost && <NewPostButton onPosted={() => load(true)} />}
        </div>
      </div>
    )
  }

  const canPost = user && ['ADMIN', 'OWNER'].includes(user.role)

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-4 max-w-xl mx-auto">
        <h1 className="font-display text-2xl font-bold">Your Feed</h1>
        {canPost && <NewPostButton onPosted={() => load(true)} />}
      </div>
      <div className="space-y-6">
        {posts.map((p) => <PostCard key={p.id} post={p} onDelete={() => onDelete(p.id)} />)}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => load(false)} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
