export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          selected_variant: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          selected_variant?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          selected_variant?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_name: string
          delivery_address: string
          delivery_fee: number | null
          email: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          phone: string
          status: string | null
          subtotal: number
          total: number
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          delivery_address: string
          delivery_fee?: number | null
          email?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          phone: string
          status?: string | null
          subtotal: number
          total: number
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          delivery_address?: string
          delivery_fee?: number | null
          email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          phone?: string
          status?: string | null
          subtotal?: number
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          availability:
            | Database["public"]["Enums"]["product_availability"]
            | null
          battery_health: number | null
          category: string | null
          color: string | null
          color_hex: string | null
          compare_at_price: number | null
          condition: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          name: string
          price: number
          reserved_at: string | null
          slug: string
          storage: string | null
          warranty_months: number | null
        }
        Insert: {
          active?: boolean | null
          availability?:
            | Database["public"]["Enums"]["product_availability"]
            | null
          battery_health?: number | null
          category?: string | null
          color?: string | null
          color_hex?: string | null
          compare_at_price?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          reserved_at?: string | null
          slug: string
          storage?: string | null
          warranty_months?: number | null
        }
        Update: {
          active?: boolean | null
          availability?:
            | Database["public"]["Enums"]["product_availability"]
            | null
          battery_health?: number | null
          category?: string | null
          color?: string | null
          color_hex?: string | null
          compare_at_price?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          reserved_at?: string | null
          slug?: string
          storage?: string | null
          warranty_months?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_sale: { Args: { p_id: string }; Returns: undefined }
      release_expired_reservations: {
        Args: { expiration_interval?: string }
        Returns: {
          order_id: string
          product_id: string
        }[]
      }
      release_product: { Args: { p_id: string }; Returns: undefined }
      reserve_product: { Args: { p_id: string }; Returns: boolean }
    }
    Enums: {
      product_availability: "available" | "reserved" | "sold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
