export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          inventory_count: number
          is_featured: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category: string
          inventory_count?: number
          is_featured?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string
          inventory_count?: number
          is_featured?: boolean
        }
      }
      product_reviews: {
        Row: {
          id: number
          created_at: string
          product_id: number
          user_id: string
          rating: number
          comment: string | null
          likes: number
          is_verified_purchase: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          product_id: number
          user_id: string
          rating: number
          comment?: string | null
          likes?: number
          is_verified_purchase?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          product_id?: number
          user_id?: string
          rating?: number
          comment?: string | null
          likes?: number
          is_verified_purchase?: boolean
        }
      }
      forum_categories: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          slug: string
          thread_count: number
          last_activity: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          slug: string
          thread_count?: number
          last_activity?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          slug?: string
          thread_count?: number
          last_activity?: string | null
        }
      }
      forum_threads: {
        Row: {
          id: number
          created_at: string
          title: string
          content: string
          user_id: string
          category_id: number
          views: number
          likes: number
          is_pinned: boolean
          is_locked: boolean
          last_activity: string
          comment_count: number
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          content: string
          user_id: string
          category_id: number
          views?: number
          likes?: number
          is_pinned?: boolean
          is_locked?: boolean
          last_activity?: string
          comment_count?: number
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          content?: string
          user_id?: string
          category_id?: number
          views?: number
          likes?: number
          is_pinned?: boolean
          is_locked?: boolean
          last_activity?: string
          comment_count?: number
        }
      }
      forum_thread_tags: {
        Row: {
          id: number
          created_at: string
          thread_id: number
          tag: string
        }
        Insert: {
          id?: number
          created_at?: string
          thread_id: number
          tag: string
        }
        Update: {
          id?: number
          created_at?: string
          thread_id?: number
          tag?: string
        }
      }
      forum_comments: {
        Row: {
          id: number
          created_at: string
          thread_id: number
          user_id: string
          content: string
          likes: number
          is_edited: boolean
          parent_id: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          thread_id: number
          user_id: string
          content: string
          likes?: number
          is_edited?: boolean
          parent_id?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          thread_id?: number
          user_id?: string
          content?: string
          likes?: number
          is_edited?: boolean
          parent_id?: number | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      orders: {
        Row: {
          id: number
          created_at: string
          user_id: string
          status: string
          total: number
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          status?: string
          total: number
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          status?: string
          total?: number
        }
      }
      order_items: {
        Row: {
          id: number
          created_at: string
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: number
          product_id?: number
          quantity?: number
          price?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
