"use client"

import { useState, useEffect } from "react"
import { Plus, LogOut, FileText, Pencil, Trash2, RefreshCw } from "lucide-react"
import { PostEditor } from "./post-editor"

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  content: string
}

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Yazilar yuklenemedi:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })

      if (response.ok) {
        setPosts(posts.filter((p) => p.slug !== slug))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error("Yazi silinemedi:", error)
    }
  }

  const handleSave = async (post: Omit<Post, "slug"> & { slug?: string }, isNew: boolean) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        await fetchPosts()
        setEditingPost(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Yazi kaydedilemedi:", error)
    }
  }

  if (isCreating || editingPost) {
    return (
      <PostEditor
        post={editingPost}
        onSave={(post) => handleSave(post, !editingPost)}
        onCancel={() => {
          setEditingPost(null)
          setIsCreating(false)
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Blog yazilarini yonet</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPosts}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yenile</span>
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Yazi</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cikis</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Henuz yazi yok</h2>
          <p className="text-muted-foreground mb-4">Ilk yazini olusturarak basla</p>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Yazi Olustur</span>
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Baslik</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Tarih</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Etiketler</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{post.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-md">{post.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Duzenle"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === post.slug ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                          >
                            Evet
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
                          >
                            Hayir
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(post.slug)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
