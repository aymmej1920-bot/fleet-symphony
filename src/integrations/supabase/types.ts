export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string | null
          document_url: string | null
          expiry_date: string
          id: string
          notes: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          expiry_date: string
          id?: string
          notes?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string
          id?: string
          notes?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          assigned_vehicle_id: string | null
          created_at: string | null
          email: string
          id: string
          license_expiry: string | null
          license_number: string
          name: string
          phone: string | null
          rating: number | null
          status: string
          total_trips: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_vehicle_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          license_expiry?: string | null
          license_number: string
          name: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_vehicle_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          license_expiry?: string | null
          license_number?: string
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          consumption: number | null
          cost: number
          created_at: string | null
          date: string
          driver_id: string | null
          id: string
          liters: number
          mileage: number
          notes: string | null
          station: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          consumption?: number | null
          cost: number
          created_at?: string | null
          date?: string
          driver_id?: string | null
          id?: string
          liters: number
          mileage: number
          notes?: string | null
          station?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          consumption?: number | null
          cost?: number
          created_at?: string | null
          date?: string
          driver_id?: string | null
          id?: string
          liters?: number
          mileage?: number
          notes?: string | null
          station?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string | null
          date: string
          id: string
          inspector: string
          issues_found: number | null
          notes: string | null
          score: number | null
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          inspector: string
          issues_found?: number | null
          notes?: string | null
          score?: number | null
          status?: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          inspector?: string
          issues_found?: number | null
          notes?: string | null
          score?: number | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          created_at: string | null
          date: string
          id: string
          mileage: number | null
          notes: string | null
          priority: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          date: string
          id?: string
          mileage?: number | null
          notes?: string | null
          priority?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          date?: string
          id?: string
          mileage?: number | null
          notes?: string | null
          priority?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          completed_stops: number | null
          created_at: string | null
          distance_km: number | null
          driver_id: string | null
          end_time: string | null
          id: string
          name: string
          start_time: string | null
          status: string
          total_stops: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          completed_stops?: number | null
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          end_time?: string | null
          id?: string
          name: string
          start_time?: string | null
          status?: string
          total_stops?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          completed_stops?: number | null
          created_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          end_time?: string | null
          id?: string
          name?: string
          start_time?: string | null
          status?: string
          total_stops?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          created_at: string | null
          fuel_level: number | null
          id: string
          mileage: number | null
          model: string
          next_maintenance_date: string | null
          plate: string
          status: string
          updated_at: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          fuel_level?: number | null
          id?: string
          mileage?: number | null
          model: string
          next_maintenance_date?: string | null
          plate: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          fuel_level?: number | null
          id?: string
          mileage?: number | null
          model?: string
          next_maintenance_date?: string | null
          plate?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
