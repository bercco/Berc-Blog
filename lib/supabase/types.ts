export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          category_id: string
          image_url: string
          inventory_count: number
          is_featured: boolean
          sales_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          category_id: string
          image_url: string
          inventory_count: number
          is_featured?: boolean
          sales_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          category_id?: string
          image_url?: string
          inventory_count?: number
          is_featured?: boolean
          sales_count?: number
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          parent_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          role: "admin" | "customer" | "manager"
          full_name: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          role?: "admin" | "customer" | "manager"
          full_name: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: "admin" | "customer" | "manager"
          full_name?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          created_at: string
          user_id: string
          message: string
          response: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          message: string
          response: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          message?: string
          response?: string
          metadata?: Json
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
