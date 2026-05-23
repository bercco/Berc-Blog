'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Trash2,
  Eye,
  Edit2,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  Search,
  Mail,
  Trash,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Post {
  id: string
  title: string
  excerpt: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  cover_image: string | null
}

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [mailDraft, setMailDraft] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (postsError) throw postsError
        setPosts(postsData || [])

        const { data: subscribersData, error: subscribersError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('is_active', true)
          .order('subscribed_at', { ascending: false })

        if (subscribersError) throw subscribersError
        setSubscribers(subscribersData || [])
      } catch (err) {
        console.error('[v0] Error loading posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)

      if (error) throw error

      setPosts(posts.filter((p) => p.id !== id))
    } catch (err) {
      console.error('[v0] Error deleting post:', err)
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Bu aboneyi silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      setSubscribers(subscribers.filter((s) => s.id !== id))
    } catch (err) {
      console.error('[v0] Error deleting subscriber:', err)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'published'
          ? post.status === 'published'
          : post.status === 'draft'

    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Paneli</h1>
              <p className="text-muted-foreground mt-1">
                Hoşgeldiniz, {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/create" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Yeni Yazı
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Yazıları ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="posts" className="flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4" />
                Yazılar
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="w-4 h-4" />
                Taslak
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2 text-xs sm:text-sm">
                Tümü
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2 text-xs sm:text-sm">
                <Mail className="w-4 h-4" />
                Bülten
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-6">
              {filteredPosts.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    {posts.length === 0
                      ? 'Henüz yazı oluşturmadınız'
                      : 'Ara sonuçları yok'}
                  </p>
                  {posts.length === 0 && (
                    <Button asChild>
                      <Link href="/admin/create">İlk Yazıyı Oluştur</Link>
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold line-clamp-2">
                              {post.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                post.status === 'published'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}
                            >
                              {post.status === 'published'
                                ? 'Yayınlanan'
                                : 'Taslak'}
                            </span>
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {post.excerpt}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.updated_at).toLocaleDateString(
                              'tr-TR'
                            )}{' '}
                            tarihinde güncellendi
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            title="Düzenle"
                          >
                            <Link href={`/admin/edit/${post.id}`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          {post.status === 'published' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Göster"
                            >
                              <Link href={`/blog/${post.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-destructive hover:text-destructive"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
