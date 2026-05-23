'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [status, setStatus] = useState('draft')
  const [coverImage, setCoverImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setPost(data)
        setTitle(data.title)
        setContent(data.content)
        setExcerpt(data.excerpt || '')
        setTags(data.tags || [])
        setStatus(data.status || 'draft')
        setCoverImage(data.cover_image || '')
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, supabase])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          content,
          excerpt,
          tags,
          status,
          cover_image: coverImage,
          updated_at: new Date().toISOString(),
          published_at: status === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', id)

      if (error) throw error

      router.push('/admin')
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return

    setDeleting(true)
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)

      if (error) throw error

      router.push('/admin')
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="mb-4"
          >
            <a href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Admin Paneline Dön
            </a>
          </Button>
          <h1 className="text-3xl font-bold">Yazıyı Düzenle</h1>
        </div>

        <Card className="p-6 space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium mb-2">Başlık</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog yazısı başlığı"
            />
          </div>

          {/* Özet */}
          <div>
            <label className="block text-sm font-medium mb-2">Özet</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Yazının kısa özeti"
              className="h-20"
            />
          </div>

          {/* Kapak Resmi */}
          <div>
            <label className="block text-sm font-medium mb-2">Kapak Resmi</label>
            <div className="flex gap-4 items-start">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Resim Seç
              </Button>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Kapak"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-sm font-medium mb-2">İçerik</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Blog yazısı içeriği (Markdown desteklenir)"
              className="h-80 font-mono text-sm"
            />
          </div>

          {/* Etiketler */}
          <div>
            <label className="block text-sm font-medium mb-2">Etiketler</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Etiket ekle ve Enter tuşuna bas"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
              >
                Ekle
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Durum */}
          <div>
            <label className="block text-sm font-medium mb-2">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayınlanmış</option>
            </select>
          </div>

          {/* Butonlar */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Kaydet
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="destructive"
              className="flex items-center gap-2 ml-auto"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash2 className="w-4 h-4" />
              Sil
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
