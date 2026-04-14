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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          category: string
          created_at: string
          id: string
          month: string
          planned_amount: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          month: string
          planned_amount?: number
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          month?: string
          planned_amount?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_debts: {
        Row: {
          created_at: string
          debt_type: string
          id: string
          monthly_payment: number
          next_due_date: string | null
          original_value: number
          paid_installments: number
          payment_method: string | null
          total_installments: number
          user_id: string
        }
        Insert: {
          created_at?: string
          debt_type?: string
          id?: string
          monthly_payment?: number
          next_due_date?: string | null
          original_value?: number
          paid_installments?: number
          payment_method?: string | null
          total_installments?: number
          user_id: string
        }
        Update: {
          created_at?: string
          debt_type?: string
          id?: string
          monthly_payment?: number
          next_due_date?: string | null
          original_value?: number
          paid_installments?: number
          payment_method?: string | null
          total_installments?: number
          user_id?: string
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          created_at: string
          doc_name: string
          file_path: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_name: string
          file_path: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_name?: string
          file_path?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      client_health_scores: {
        Row: {
          breakdown: Json | null
          calculated_at: string
          id: string
          p1_score: number
          p2_score: number
          p3_score: number
          p4_score: number
          score: number
          user_id: string
        }
        Insert: {
          breakdown?: Json | null
          calculated_at?: string
          id?: string
          p1_score?: number
          p2_score?: number
          p3_score?: number
          p4_score?: number
          score?: number
          user_id: string
        }
        Update: {
          breakdown?: Json | null
          calculated_at?: string
          id?: string
          p1_score?: number
          p2_score?: number
          p3_score?: number
          p4_score?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      client_invites: {
        Row: {
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          status: string
          token: string
        }
        Insert: {
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          status?: string
          token?: string
        }
        Update: {
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
      client_monthly_snapshots: {
        Row: {
          created_at: string
          despesas: number
          health_score: number
          id: string
          month: string
          patrimonio_liquido: number
          receitas: number
          resultado: number
          user_id: string
        }
        Insert: {
          created_at?: string
          despesas?: number
          health_score?: number
          id?: string
          month: string
          patrimonio_liquido?: number
          receitas?: number
          resultado?: number
          user_id: string
        }
        Update: {
          created_at?: string
          despesas?: number
          health_score?: number
          id?: string
          month?: string
          patrimonio_liquido?: number
          receitas?: number
          resultado?: number
          user_id?: string
        }
        Relationships: []
      }
      consultant_notes: {
        Row: {
          author_id: string
          category: string
          client_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string
          client_id: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      financial_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_download_logs: {
        Row: {
          created_at: string
          file_path: string
          id: string
          lead_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          lead_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_download_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          nome: string
          page_path: string | null
          propriedade: string | null
          segmento: string | null
          telefone: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wants_checklist: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          nome: string
          page_path?: string | null
          propriedade?: string | null
          segmento?: string | null
          telefone: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wants_checklist?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          nome?: string
          page_path?: string | null
          propriedade?: string | null
          segmento?: string | null
          telefone?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wants_checklist?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          activity_type: string | null
          assets_investments: string | null
          assets_liabilities_data: Json | null
          assets_other: string | null
          assets_realestate: string | null
          assets_vehicles: string | null
          created_at: string
          expenses_data: Json | null
          financial_reserves: string | null
          fixed_costs_detail: string | null
          fixed_costs_total: string | null
          goals: string | null
          housing_data: Json | null
          id: string
          income_data: Json | null
          monthly_revenue: string | null
          onboarding_step: number | null
          personal_data: Json | null
          profile_module_data: Json | null
          revenue_sources: string | null
          total_debt: string | null
          updated_at: string
          user_id: string
          variable_costs_detail: string | null
          variable_costs_total: string | null
        }
        Insert: {
          activity_type?: string | null
          assets_investments?: string | null
          assets_liabilities_data?: Json | null
          assets_other?: string | null
          assets_realestate?: string | null
          assets_vehicles?: string | null
          created_at?: string
          expenses_data?: Json | null
          financial_reserves?: string | null
          fixed_costs_detail?: string | null
          fixed_costs_total?: string | null
          goals?: string | null
          housing_data?: Json | null
          id?: string
          income_data?: Json | null
          monthly_revenue?: string | null
          onboarding_step?: number | null
          personal_data?: Json | null
          profile_module_data?: Json | null
          revenue_sources?: string | null
          total_debt?: string | null
          updated_at?: string
          user_id: string
          variable_costs_detail?: string | null
          variable_costs_total?: string | null
        }
        Update: {
          activity_type?: string | null
          assets_investments?: string | null
          assets_liabilities_data?: Json | null
          assets_other?: string | null
          assets_realestate?: string | null
          assets_vehicles?: string | null
          created_at?: string
          expenses_data?: Json | null
          financial_reserves?: string | null
          fixed_costs_detail?: string | null
          fixed_costs_total?: string | null
          goals?: string | null
          housing_data?: Json | null
          id?: string
          income_data?: Json | null
          monthly_revenue?: string | null
          onboarding_step?: number | null
          personal_data?: Json | null
          profile_module_data?: Json | null
          revenue_sources?: string | null
          total_debt?: string | null
          updated_at?: string
          user_id?: string
          variable_costs_detail?: string | null
          variable_costs_total?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cnpj: string | null
          company_name: string | null
          cpf: string | null
          created_at: string
          full_name: string
          health_score: number | null
          id: string
          last_score_update: string | null
          onboarding_completed: boolean
          phone: string | null
          sector: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string
          health_score?: number | null
          id: string
          last_score_update?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          sector?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string
          health_score?: number | null
          id?: string
          last_score_update?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
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
      app_role: ["admin", "client"],
    },
  },
} as const
