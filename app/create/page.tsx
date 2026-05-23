"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Upload, Sparkles, X, ImagePlus, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploading: boolean
  url?: string
}

export default function CreateBlogPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) throw new Error("Upload failed")
      
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue
      
      const id = crypto.randomUUID()
      const preview = URL.createObjectURL(file)
      
      setImages(prev => [...prev, { id, file, preview, uploading: true }])
      
      const url = await uploadImage(file)
      
      setImages(prev => 
        prev.map(img => 
          img.id === id 
            ? { ...img, uploading: false, url: url || undefined }
            : img
        )
      )
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      streamRef.current = stream
      setIsCameraOpen(true)
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (error) {
      console.error("Camera error:", error)
      alert("Kameraya erişilemedi. Lütfen izinleri kontrol edin.")
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.drawImage(videoRef.current, 0, 0)
    
    canvas.toBlob(async (blob) => {
      if (!blob) return
      
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })
      const id = crypto.randomUUID()
      const preview = URL.createObjectURL(blob)
      
      setImages(prev => [...prev, { id, file, preview, uploading: true }])
      
      const url = await uploadImage(file)
      
      setImages(prev => 
        prev.map(img => 
          img.id === id 
            ? { ...img, uploading: false, url: url || undefined }
            : img
        )
      )
    }, "image/jpeg", 0.9)
    
    closeCamera()
  }, [])

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraOpen(false)
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) {
        URL.revokeObjectURL(img.preview)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const generateContent = async () => {
    if (images.length === 0) {
      alert("Lütfen en az bir fotoğraf ekleyin.")
      return
    }

    const uploadedImages = images.filter(img => img.url)
    if (uploadedImages.length === 0) {
      alert("Fotoğraflar yüklenirken bekleyin.")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: uploadedImages.map(img => img.url),
        }),
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      
      setTitle(data.title || "")
      setContent(data.content || "")
      setTags(data.tags || [])
    } catch (error) {
      console.error("Generation error:", error)
      alert("İçerik oluşturulurken bir hata oluştu.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags(prev => [...prev, tagInput.trim().toLowerCase()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Lütfen başlık ve içerik alanlarını doldurun.")
      return
    }

    setIsPublishing(true)
    
    // Here you would typically save to your database
    // For now, we'll just show a success message
    setTimeout(() => {
      setIsPublishing(false)
      alert("Blog yazınız başarıyla oluşturuldu!")
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-balance">Yeni Blog Yazısı</h1>
        <p className="text-muted-foreground">
          Fotoğraflarınızı yükleyin, AI size içerik oluştursun.
        </p>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
            <Button 
              variant="outline" 
              size="lg"
              onClick={closeCamera}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5 mr-2" />
              Kapat
            </Button>
            <Button 
              size="lg"
              onClick={capturePhoto}
              className="bg-white text-black hover:bg-white/90"
            >
              <Camera className="w-5 h-5 mr-2" />
              Fotoğraf Çek
            </Button>
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Fotoğraflar</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Yükle
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openCamera}
            >
              <Camera className="w-4 h-4 mr-2" />
              Kamera
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {images.length === 0 ? (
          <div 
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Fotoğraflarınızı buraya sürükleyin veya tıklayın
            </p>
            <p className="text-sm text-muted-foreground">
              veya kameranızı kullanarak anlık fotoğraf çekin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-square group">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {image.uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            <div 
              className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </Card>

      {/* AI Generate Button */}
      {images.length > 0 && (
        <div className="mb-6">
          <Button 
            onClick={generateContent}
            disabled={isGenerating || images.some(img => img.uploading)}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI İçerik Oluşturuyor...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                AI ile İçerik Oluştur
              </>
            )}
          </Button>
        </div>
      )}

      {/* Content Editor */}
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog yazınızın başlığı..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">İçerik</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Blog içeriğinizi yazın veya AI'ın oluşturmasını bekleyin..."
              className="min-h-[300px] resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Etiketler</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Etiket ekle ve Enter'a bas..."
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Publish Button */}
      <Button 
        onClick={handlePublish}
        disabled={isPublishing || !title.trim() || !content.trim()}
        className="w-full"
        size="lg"
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Yayınlanıyor...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Yayınla
          </>
        )}
      </Button>
    </div>
  )
}
