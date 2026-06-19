'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { PostCard } from '@/components/post-card'
import { NewPostButton } from '@/components/new-post-button'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Compass } from 'lucide-react'

const CATEGORIES = [
  { value: 'ALL', label: 'All' },
  { value: 'HAIRSTYLE', label: 'Hairstyles' },
  { value: 'MEHNDI', label: 'Mehndi' },
  { value: 'MAKEUP', label: 'Makeup' },
  { value: 'BRIDAL', label: 'Bridal' },
]

export function ExploreView() {
  const { user } = useApp()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [category, setCategory] = useState('ALL')

  const load = useCallback(async (cat: string, reset = false) => {
    setLoading(true)
    setOffset(0)
    try {
      const d = await apiFetch(`/api/explore?limit=20&offset=0&category=${cat}`)
      setPosts(d.posts)
      setHasMore(d.hasMore)
      setOffset(20)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { load('ALL') }, [])

  async function loadMore() {
    const d = await apiFetch(`/api/explore?limit=20&offset=${offset}&category=${category}`)
    setPosts((p) => [...p, ...d.posts])
    setHasMore(d.hasMore)
    setOffset((o) => o + 20)
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Explore</h1>
        </div>
        {user && ['ADMIN', 'OWNER'].includes(user.role) && <NewPostButton onPosted={() => load(category, true)} />}
      </div>

      <Tabs value={category} onValueChange={(v) => { setCategory(v); load(v) }} className="mb-6">
        <TabsList className="flex w-full justify-start overflow-x-auto no-scrollbar h-auto p-1">
          {CATEGORIES.map((c) => <TabsTrigger key={c.value} value={c.value} className="shrink-0">{c.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No posts in this category yet.</p>
        </div>
      ) : (
        <>
          {/* Masonry-like grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="break-inside-avoid mb-3">
                <PostCard post={p} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={loadMore}>Load More</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
