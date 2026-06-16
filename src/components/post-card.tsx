'use client'

import { useState, useEffect } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Flag, Send } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { timeAgo } from '@/lib/time'

export function PostCard({ post, onDelete }: { post: any; onDelete?: () => void }) {
  const { user } = useApp()
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  async function toggleLike() {
    if (!user) return
    setLiked(!liked)
    setLikeCount((c) => c + (liked ? -1 : 1))
    try {
      await apiFetch('/api/posts/like', { method: 'POST', body: JSON.stringify({ postId: post.id }) })
    } catch {}
  }

  async function loadComments() {
    setLoadingComments(true)
    try {
      const d = await apiFetch(`/api/posts/comment?postId=${post.id}`)
      setComments(d.comments)
    } catch {} finally { setLoadingComments(false) }
  }

  async function addComment() {
    if (!commentText.trim() || !user) return
    try {
      const d = await apiFetch('/api/posts/comment', { method: 'POST', body: JSON.stringify({ postId: post.id, text: commentText }) })
      setComments((c) => [...c, d.comment])
      setCommentText('')
    } catch (e: any) { toast.error(e.message) }
  }

  async function report() {
    if (!user) return
    try {
      await apiFetch('/api/admin/reports', { method: 'POST', body: JSON.stringify({ postId: post.id, reason: 'Inappropriate content' }) })
      toast.success('Reported. Admins will review.')
    } catch {}
  }

  async function deletePost() {
    try {
      await apiFetch(`/api/posts?id=${post.id}`, { method: 'DELETE' })
      toast.success('Post deleted')
      onDelete?.()
    } catch (e: any) { toast.error(e.message) }
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: 'Check this out!', text: post.caption, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  useEffect(() => {
    if (showComments && comments.length === 0) loadComments()
  }, [showComments])

  return (
    <>
      <Card className="overflow-hidden max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm flex items-center gap-1">
              {post.author.name}
              {post.author.role === 'STYLIST' && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Stylist</span>}
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user?.id === post.authorId && (
                <DropdownMenuItem onClick={deletePost} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={report}><Flag className="w-4 h-4 mr-2" /> Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        <div className="relative cursor-pointer bg-muted" onClick={() => setFullscreen(true)}>
          <img src={post.image} alt={post.caption || 'Post'} className="w-full aspect-square object-cover" loading="lazy" />
          {post.category && (
            <span className="absolute top-2 left-2 text-[10px] bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur">{post.category}</span>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm hover:text-primary transition">
              <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm hover:text-primary transition">
              <MessageCircle className="w-5 h-5" />
              <span>{post._count?.comments || 0}</span>
            </button>
            <button onClick={share} className="flex items-center gap-1.5 text-sm hover:text-primary transition ml-auto">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {post.caption && <p className="text-sm mb-2"><span className="font-semibold">{post.author.name}</span> {post.caption}</p>}

          {showComments && (
            <div className="space-y-2 pt-2 border-t">
              {loadingComments && <p className="text-xs text-muted-foreground">Loading comments...</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2 items-start">
                  <Avatar className="w-6 h-6"><AvatarImage src={c.user.avatar} /><AvatarFallback>{c.user.name[0]}</AvatarFallback></Avatar>
                  <div className="bg-muted rounded-xl px-3 py-1.5 flex-1">
                    <p className="text-xs font-semibold">{c.user.name}</p>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
              {user && (
                <div className="flex gap-2 pt-1">
                  <Input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} placeholder="Add a comment..." className="h-8 text-sm" />
                  <Button size="icon" onClick={addComment} className="h-8 w-8 bg-brand-gradient text-white shrink-0"><Send className="w-3 h-3" /></Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Fullscreen view */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="sr-only"><DialogTitle>Post</DialogTitle></DialogHeader>
          <div className="grid md:grid-cols-2">
            <div className="bg-black flex items-center justify-center">
              <img src={post.image} alt={post.caption} className="w-full max-h-[80vh] object-contain" />
            </div>
            <div className="flex flex-col max-h-[80vh]">
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar className="w-10 h-10"><AvatarImage src={post.author.avatar} /><AvatarFallback>{post.author.name[0]}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                </div>
              </div>
              {post.caption && <p className="p-4 text-sm border-b">{post.caption}</p>}
              <div className="flex-1 overflow-y-auto p-4 custom-scroll">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No comments yet</p>
                ) : comments.map((c) => (
                  <div key={c.id} className="flex gap-2 items-start mb-3">
                    <Avatar className="w-8 h-8"><AvatarImage src={c.user.avatar} /><AvatarFallback>{c.user.name[0]}</AvatarFallback></Avatar>
                    <div className="bg-muted rounded-xl px-3 py-2 flex-1">
                      <p className="text-xs font-semibold">{c.user.name}</p>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex items-center gap-3">
                <button onClick={toggleLike} className="flex items-center gap-1.5"><Heart className={`w-6 h-6 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} /><span className="text-sm">{likeCount}</span></button>
                {user && (
                  <div className="flex gap-2 flex-1">
                    <Input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} placeholder="Add a comment..." className="text-sm" />
                    <Button size="icon" onClick={addComment} className="bg-brand-gradient text-white"><Send className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
