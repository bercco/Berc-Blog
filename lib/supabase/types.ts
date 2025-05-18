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
          image_url: string
          category_id: string
          inventory_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          image_url: string
          category_id: string
          inventory_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category_id?: string
          inventory_count?: number
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          avatar_url: string | null
          role: "admin" | "customer"
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name: string
          avatar_url?: string | null
          role?: "admin" | "customer"
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          avatar_url?: string | null
          role?: "admin" | "customer"
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: "pending" | "processing" | "completed" | "cancelled"
          total: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          total: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          total?: number
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
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
