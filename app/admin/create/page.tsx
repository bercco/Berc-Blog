'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Upload, Sparkles, X, ImagePlus, Loader2, Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploading: boolean
  url?: string
}

export default function CreateAdminBlogPage() {
  const router = useRouter()
  const supabase = createClient()
  const [images, setImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [user, setUser] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    }
    checkAuth()
  }, [router, supabase])

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('[v0] Upload error:', error)
      return null
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue

      const id = crypto.randomUUID()
      const preview = URL.createObjectURL(file)

      setImages((prev) => [...prev, { id, file, preview, uploading: true }])

      const url = await uploadImage(file)

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, uploading: false, url: url || undefined }
            : img
        )
      )
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setIsCameraOpen(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (error) {
      console.error('[v0] Camera error:', error)
      alert('Kameraya erişilemedi. Lütfen izinleri kontrol edin.')
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File([blob], `camera-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
      const id = crypto.randomUUID()
      const preview = URL.createObjectURL(file)

      setImages((prev) => [...prev, { id, file, preview, uploading: true }])

      const url = await uploadImage(file)

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, uploading: false, url: url || undefined }
            : img
        )
      )

      closeCamera()
    })
  }, [])

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsCameraOpen(false)
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const generateContent = async () => {
    if (images.length === 0) {
      alert('Lütfen en az bir fotoğraf yükleyin')
      return
    }

    setIsGenerating(true)

    try {
      const uploadedImages = images.filter((img) => img.url)

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: uploadedImages.map((img) => img.url),
        }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const data = await response.json()

      setTitle(data.title || '')
      setExcerpt(data.excerpt || '')
      setContent(data.content || '')
      setTags(data.tags || [])
    } catch (error) {
      console.error('[v0] Generation error:', error)
      alert('İçerik oluşturma başarısız oldu')
    } finally {
      setIsGenerating(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const publishBlog = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Başlık ve içerik gereklidir')
      return
    }

    setIsPublishing(true)

    try {
      const coverImage = images.find((img) => img.url)?.url || null

      const { error } = await supabase.from('posts').insert([
        {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          cover_image: coverImage,
          tags,
          status,
          user_id: user.id,
          published_at: status === 'published' ? new Date() : null,
        },
      ])

      if (error) throw error

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('[v0] Publish error:', error)
      alert('Yazı yayınlanırken hata oluştu')
    } finally {
      setIsPublishing(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative z-10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Admin Paneline Dön
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı Oluştur</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Fotoğraflar</h2>

              <div className="space-y-4">
                {/* Upload Area */}
                {!isCameraOpen && (
                  <div
                    className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Fotoğraf sürükle veya tıkla
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Camera Section */}
                {isCameraOpen && (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Fotoğraf Çek
                      </Button>
                      <Button onClick={closeCamera} variant="outline" className="flex-1">
                        İptal
                      </Button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                {!isCameraOpen && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Yükle
                    </Button>
                    <Button
                      onClick={openCamera}
                      variant="outline"
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Kamera
                    </Button>
                  </div>
                )}

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="relative bg-muted rounded-lg overflow-hidden aspect-square group"
                      >
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Generate Button */}
                {images.length > 0 && (
                  <Button
                    onClick={generateContent}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        İçerik Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI ile İçerik Oluştur
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>

            {/* Content Section */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Yazı İçeriği</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Blog yazısının başlığı..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Özet (İsteğe bağlı)
                </label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kısa özet..."
                  className="w-full"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">İçerik</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Blog yazısının içeriği (Markdown desteklidir)..."
                  className="w-full"
                  rows={10}
                />
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Etiketler</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Etiket yazıp Enter tuşuna basın..."
                  />
                  <Button onClick={addTag} variant="outline">
                    Ekle
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Yayımlama</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Durum</label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={status === 'draft' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setStatus('draft')}
                    >
                      Taslak
                    </Button>
                    <Button
                      variant={status === 'published' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setStatus('published')}
                    >
                      Yayınla
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={publishBlog}
                  disabled={isPublishing || !title.trim() || !content.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-sm mb-2">İpuçları</h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Fotoğraf yükleyip AI ile otomatik içerik oluşturun</li>
                <li>• Taslak olarak kaydedip daha sonra düzenleyin</li>
                <li>• Etiketler yazıları kategorize etmeye yardımcı olur</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
