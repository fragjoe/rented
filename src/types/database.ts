// Auto-generated from Supabase — uxqkjplfrrqhnfprpxag
// Run: npx supabase gen types typescript --project-id uxqkjplfrrqhnfprpxag

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
      audit_logs: {
        Row: {
          action: Database['public']['Enums']['audit_action']
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: Database['public']['Enums']['audit_action']
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: Database['public']['Enums']['audit_action']
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      charge_rules: {
        Row: {
          amount: number
          charge_type_id: string
          created_at: string
          created_by: string | null
          id: string
          is_shared: boolean
          location_id: string
          notes: string | null
          period: Database['public']['Enums']['charge_period']
          updated_at: string
        }
        Insert: {
          amount?: number
          charge_type_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_shared?: boolean
          location_id: string
          notes?: string | null
          period?: Database['public']['Enums']['charge_period']
          updated_at?: string
        }
        Update: {
          amount?: number
          charge_type_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_shared?: boolean
          location_id?: string
          notes?: string | null
          period?: Database['public']['Enums']['charge_period']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'charge_rules_charge_type_id_fkey'
            columns: ['charge_type_id']
            isOneToOne: false
            referencedRelation: 'charge_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'charge_rules_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'charge_rules_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
        ]
      }
      charge_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_per_unit: boolean
          is_recurring: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_per_unit?: boolean
          is_recurring?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_per_unit?: boolean
          is_recurring?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deposit_amount: number
          end_date: string | null
          id: string
          monthly_rate: number
          notes: string | null
          start_date: string
          status: Database['public']['Enums']['contract_status']
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deposit_amount?: number
          end_date?: string | null
          id?: string
          monthly_rate: number
          notes?: string | null
          start_date: string
          status?: Database['public']['Enums']['contract_status']
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deposit_amount?: number
          end_date?: string | null
          id?: string
          monthly_rate?: number
          notes?: string | null
          start_date?: string
          status?: Database['public']['Enums']['contract_status']
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contracts_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contracts_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contracts_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'units'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          id_card_number: string | null
          id_card_photo_url: string | null
          notes: string | null
          occupation: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          id_card_number?: string | null
          id_card_photo_url?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          id_card_number?: string | null
          id_card_photo_url?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customers_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          charge_type_id: string | null
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount?: number
          charge_type_id?: string | null
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          charge_type_id?: string | null
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'invoice_items_charge_type_id_fkey'
            columns: ['charge_type_id']
            isOneToOne: false
            referencedRelation: 'charge_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoice_items_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices'
            referencedColumns: ['id']
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          contract_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          period_end: string
          period_start: string
          status: Database['public']['Enums']['invoice_status']
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          contract_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          period_end: string
          period_start: string
          status?: Database['public']['Enums']['invoice_status']
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          contract_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          status?: Database['public']['Enums']['invoice_status']
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_contract_id_fkey'
            columns: ['contract_id']
            isOneToOne: false
            referencedRelation: 'contracts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoices_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string
          city?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'locations_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      maintenance: {
        Row: {
          completed_date: string | null
          cost: number
          created_at: string
          description: string
          id: string
          notes: string | null
          reported_by: string | null
          reported_date: string
          status: Database['public']['Enums']['maintenance_status']
          unit_id: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          completed_date?: string | null
          cost?: number
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          reported_by?: string | null
          reported_date?: string
          status?: Database['public']['Enums']['maintenance_status']
          unit_id: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          completed_date?: string | null
          cost?: number
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          reported_by?: string | null
          reported_date?: string
          status?: Database['public']['Enums']['maintenance_status']
          unit_id?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'maintenance_reported_by_fkey'
            columns: ['reported_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenance_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'units'
            referencedColumns: ['id']
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          bank_account: string | null
          bank_name: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          id: string
          id_card_number: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          id_card_number?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          id_card_number?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'owners_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          deleted_at: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: Database['public']['Enums']['payment_method']
          processed_by: string | null
          proof_of_payment_url: string | null
          reference_number: string | null
          sender_account: string | null
          sender_bank: string | null
          status: Database['public']['Enums']['payment_status']
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: Database['public']['Enums']['payment_method']
          processed_by?: string | null
          proof_of_payment_url?: string | null
          reference_number?: string | null
          sender_account?: string | null
          sender_bank?: string | null
          status?: Database['public']['Enums']['payment_status']
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database['public']['Enums']['payment_method']
          processed_by?: string | null
          proof_of_payment_url?: string | null
          reference_number?: string | null
          sender_account?: string | null
          sender_bank?: string | null
          status?: Database['public']['Enums']['payment_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_processed_by_fkey'
            columns: ['processed_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      shared_utilities: {
        Row: {
          created_at: string
          created_by: string | null
          divided_by: number
          id: string
          location_id: string
          notes: string | null
          per_unit_amount: number
          period: string
          total_amount: number
          type: Database['public']['Enums']['utility_type']
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          divided_by?: number
          id?: string
          location_id: string
          notes?: string | null
          per_unit_amount?: number
          period: string
          total_amount: number
          type: Database['public']['Enums']['utility_type']
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          divided_by?: number
          id?: string
          location_id?: string
          notes?: string | null
          per_unit_amount?: number
          period?: string
          total_amount?: number
          type?: Database['public']['Enums']['utility_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shared_utilities_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shared_utilities_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
        ]
      }
      units: {
        Row: {
          capacity: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deposit_amount: number
          features: string[]
          floor: number
          id: string
          location_id: string
          monthly_rate: number
          notes: string | null
          owner_id: string | null
          status: Database['public']['Enums']['unit_status']
          unit_number: string
          unit_type: Database['public']['Enums']['unit_type']
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deposit_amount?: number
          features?: string[]
          floor?: number
          id?: string
          location_id: string
          monthly_rate?: number
          notes?: string | null
          owner_id?: string | null
          status?: Database['public']['Enums']['unit_status']
          unit_number: string
          unit_type?: Database['public']['Enums']['unit_type']
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deposit_amount?: number
          features?: string[]
          floor?: number
          id?: string
          location_id?: string
          monthly_rate?: number
          notes?: string | null
          owner_id?: string | null
          status?: Database['public']['Enums']['unit_status']
          unit_number?: string
          unit_type?: Database['public']['Enums']['unit_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'units_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'units_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'units_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'owners'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name?: string
          id: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      audit_action: 'insert' | 'update' | 'delete'
      charge_period: 'monthly' | 'one_time'
      contract_status: 'active' | 'ended' | 'terminated'
      invoice_status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled'
      maintenance_status: 'reported' | 'in_progress' | 'completed' | 'cancelled'
      payment_method: 'cash' | 'transfer' | 'ewallet' | 'qris'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      unit_status: 'available' | 'occupied' | 'maintenance' | 'reserved'
      unit_type: 'room' | 'parking'
      utility_type: 'electricity' | 'water' | 'gas' | 'internet' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Re-export enums for convenience
export type invoice_status = Database['public']['Enums']['invoice_status']
export type unit_type = Database['public']['Enums']['unit_type']
export type unit_status = Database['public']['Enums']['unit_status']
export type contract_status = Database['public']['Enums']['contract_status']
export type charge_period = Database['public']['Enums']['charge_period']
export type payment_method = Database['public']['Enums']['payment_method']
export type payment_status = Database['public']['Enums']['payment_status']
export type maintenance_status = Database['public']['Enums']['maintenance_status']
export type utility_type = Database['public']['Enums']['utility_type']
export type audit_action = Database['public']['Enums']['audit_action']
