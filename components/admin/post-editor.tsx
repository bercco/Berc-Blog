"use client"

import { useState } from "react"
import { ArrowLeft, Save, X, Plus } from "lucide-react"

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  content: string
}

interface PostEditorProps {
  post: Post | null
  onSave: (post: Omit<Post, "slug"> & { slug?: string }) => void
  onCancel: () => void
}

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [date, setDate] = useState(post?.date ? post.date.split("T")[0] : new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState(post?.description || "")
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [content, setContent] = useState(post?.content || "")
  const [isSaving, setIsSaving] = useState(false)

  const isEditing = !!post

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await onSave({
        slug: isEditing ? post.slug : slug,
        title,
        date,
        tags,
        description,
        content,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri Don</span>
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? "Yaziyi Duzenle" : "Yeni Yazi Olustur"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Baslik <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Yazi basligi"
                required
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                Slug <span className="text-destructive">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="yazi-url-slug"
                required
                disabled={isEditing}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-foreground">
              Tarih
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Aciklama
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yazinin kisa aciklamasi..."
              rows={2}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Etiketler</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Etiket ekle..."
                className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
            Icerik (MDX) <span className="text-destructive">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Yazi icerigi... (Markdown desteklenir)"
            required
            rows={20}
            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground font-mono text-sm resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Iptal
          </button>
          <button
            type="submit"
            disabled={isSaving || !title || !content}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{isEditing ? "Guncelle" : "Kaydet"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
