'use client'

import { useState } from 'react'
import { apiFetch, useApp } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, ImagePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function NewPostButton({ onPosted }: { onPosted?: () => void }) {
  const { user } = useApp()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('HAIRSTYLE')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const res = await apiFetch('/api/upload', { method: 'POST', body: JSON.stringify({ image: reader.result }) })
        setImage(res.url)
      } catch (e: any) { toast.error(e.message) } finally { setUploading(false) }
    }
    reader.readAsDataURL(file)
  }

  async function submit() {
    if (!image) { toast.error('Please add an image'); return }
    setPosting(true)
    try {
      await apiFetch('/api/posts', { method: 'POST', body: JSON.stringify({ image, caption, category }) })
      toast.success('Posted!')
      setOpen(false); setImage(null); setCaption(''); setCategory('HAIRSTYLE')
      onPosted?.()
    } catch (e: any) { toast.error(e.message) } finally { setPosting(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-gradient text-white gap-1.5"><Plus className="w-4 h-4" /> New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Style</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!image ? (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-12 cursor-pointer hover:bg-muted/50 transition">
              {uploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <ImagePlus className="w-8 h-8 text-muted-foreground" />}
              <span className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Tap to upload an image'}</span>
              <span className="text-xs text-muted-foreground">PNG/JPG, max 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <div className="relative">
              <img src={image} alt="preview" className="w-full aspect-square object-cover rounded-xl" />
              <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => setImage(null)}>Change</Button>
            </div>
          )}
          <div className="space-y-2">
            <Label>Category</Label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="HAIRSTYLE">Hairstyle</option>
              <option value="MEHNDI">Mehndi</option>
              <option value="MAKEUP">Makeup</option>
              <option value="BRIDAL">Bridal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Caption (optional)</Label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share something about this look..." maxLength={500} rows={3} />
          </div>
          <Button onClick={submit} disabled={posting || !image} className="w-full bg-brand-gradient text-white">
            {posting ? 'Posting...' : 'Share Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
