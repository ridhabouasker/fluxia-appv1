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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customer: {
        Row: {
          active: boolean
          address: string | null
          address_2: string | null
          city: string | null
          country_code: string
          created_at: string
          email: string | null
          firm_id: string
          id: string
          legal_entity: boolean
          name: string
          phone: string | null
          postal_code: string | null
          sector: string | null
          sub_sector: string | null
          tax_ref_main: string | null
          tax_ref_vat: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          address_2?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          email?: string | null
          firm_id: string
          id?: string
          legal_entity?: boolean
          name: string
          phone?: string | null
          postal_code?: string | null
          sector?: string | null
          sub_sector?: string | null
          tax_ref_main?: string | null
          tax_ref_vat?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          address_2?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          email?: string | null
          firm_id?: string
          id?: string
          legal_entity?: boolean
          name?: string
          phone?: string | null
          postal_code?: string | null
          sector?: string | null
          sub_sector?: string | null
          tax_ref_main?: string | null
          tax_ref_vat?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
        ]
      }
      document: {
        Row: {
          created_at: string
          customer_id: string
          file: boolean
          filename: string | null
          firm_id: string
          id: string
          message_body: string | null
          mime_type: string | null
          months: number[] | null
          notes: string | null
          size_kb: number | null
          source: string
          status: string
          storage_path: string | null
          type_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          file?: boolean
          filename?: string | null
          firm_id: string
          id?: string
          message_body?: string | null
          mime_type?: string | null
          months?: number[] | null
          notes?: string | null
          size_kb?: number | null
          source: string
          status?: string
          storage_path?: string | null
          type_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          file?: boolean
          filename?: string | null
          firm_id?: string
          id?: string
          message_body?: string | null
          mime_type?: string | null
          months?: number[] | null
          notes?: string | null
          size_kb?: number | null
          source?: string
          status?: string
          storage_path?: string | null
          type_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "document_type"
            referencedColumns: ["id"]
          },
        ]
      }
      document_event: {
        Row: {
          comment: string | null
          created_at: string
          document_id: string
          event_type: string
          id: string
          new_status: string | null
          old_status: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          document_id: string
          event_type: string
          id?: string
          new_status?: string | null
          old_status?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          document_id?: string
          event_type?: string
          id?: string
          new_status?: string | null
          old_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_event_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_event_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["id"]
          },
        ]
      }
      document_type: {
        Row: {
          active: boolean
          country_code: string
          created_at: string
          customer: boolean
          id: string
          name: string
          rank: number
        }
        Insert: {
          active?: boolean
          country_code?: string
          created_at?: string
          customer?: boolean
          id?: string
          name: string
          rank?: number
        }
        Update: {
          active?: boolean
          country_code?: string
          created_at?: string
          customer?: boolean
          id?: string
          name?: string
          rank?: number
        }
        Relationships: []
      }
      firm: {
        Row: {
          accounting_software: string | null
          active: boolean
          address: string | null
          address_2: string | null
          city: string | null
          country_code: string
          created_at: string
          email: string | null
          hosting_type: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          slug: string
          software_version: string | null
          tax_ref_main: string | null
          tax_ref_vat: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accounting_software?: string | null
          active?: boolean
          address?: string | null
          address_2?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          email?: string | null
          hosting_type?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          slug: string
          software_version?: string | null
          tax_ref_main?: string | null
          tax_ref_vat?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accounting_software?: string | null
          active?: boolean
          address?: string | null
          address_2?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          email?: string | null
          hosting_type?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          slug?: string
          software_version?: string | null
          tax_ref_main?: string | null
          tax_ref_vat?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      message: {
        Row: {
          body: string
          created_at: string
          customer_id: string
          firm_id: string
          id: string
          object_id: string
          object_type: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          customer_id: string
          firm_id: string
          id?: string
          object_id: string
          object_type: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string
          firm_id?: string
          id?: string
          object_id?: string
          object_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipient: {
        Row: {
          message_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          message_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          message_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_recipient_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_task: {
        Row: {
          active: boolean
          country_code: string
          created_at: string
          customer_task: boolean
          due_months: number[]
          firm_id: string | null
          id: string
          name: string
          rank: number
        }
        Insert: {
          active?: boolean
          country_code: string
          created_at?: string
          customer_task?: boolean
          due_months: number[]
          firm_id?: string | null
          id?: string
          name: string
          rank?: number
        }
        Update: {
          active?: boolean
          country_code?: string
          created_at?: string
          customer_task?: boolean
          due_months?: number[]
          firm_id?: string | null
          id?: string
          name?: string
          rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "recurring_task_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_task_status: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          firm_id: string
          id: string
          month: number
          recurring_task_id: string
          status: string
          updated_at: string | null
          updated_by: string | null
          year: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          firm_id: string
          id?: string
          month: number
          recurring_task_id: string
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          year: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          firm_id?: string
          id?: string
          month?: number
          recurring_task_id?: string
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "recurring_task_status_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_task_status_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_task_status_recurring_task_id_fkey"
            columns: ["recurring_task_id"]
            isOneToOne: false
            referencedRelation: "recurring_task"
            referencedColumns: ["id"]
          },
        ]
      }
      user_customer: {
        Row: {
          admin: boolean
          created_at: string
          customer_id: string
          user_id: string
        }
        Insert: {
          admin?: boolean
          created_at?: string
          customer_id: string
          user_id: string
        }
        Update: {
          admin?: boolean
          created_at?: string
          customer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_customer_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_customer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["id"]
          },
        ]
      }
      user_data: {
        Row: {
          active: boolean
          admin: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          firm_id: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          admin?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          firm_id?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          admin?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          firm_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_data_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitation: {
        Row: {
          accepted_at: string | null
          created_at: string
          customer_id: string | null
          email: string
          expires_at: string
          firm_id: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["user_role"]
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          expires_at?: string
          firm_id: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          expires_at?: string
          firm_id?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitation_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitation_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitation_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          p_first_name: string
          p_last_name: string
          p_token: string
          p_user_id: string
        }
        Returns: undefined
      }
      check_user_customer_same_firm: {
        Args: { cid: string; uid: string }
        Returns: boolean
      }
      create_cabinet: {
        Args: {
          p_country_code: string
          p_firm_name: string
          p_first_name: string
          p_last_name: string
          p_slug: string
        }
        Returns: string
      }
      get_invitation_by_token: { Args: { p_token: string }; Returns: Json }
      my_firm_id: { Args: never; Returns: string }
    }
    Enums: {
      user_role: "firm" | "customer" | "master"
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
    Enums: {
      user_role: ["firm", "customer", "master"],
    },
  },
} as const
