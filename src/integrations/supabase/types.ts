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
      admin_compromissos: {
        Row: {
          cliente_id: string | null
          cliente_pj_id: string | null
          created_at: string
          data_hora: string
          descricao: string | null
          duracao_minutos: number | null
          google_calendar_id: string | null
          id: string
          operacao_id: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          cliente_pj_id?: string | null
          created_at?: string
          data_hora: string
          descricao?: string | null
          duracao_minutos?: number | null
          google_calendar_id?: string | null
          id?: string
          operacao_id?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          cliente_pj_id?: string | null
          created_at?: string
          data_hora?: string
          descricao?: string | null
          duracao_minutos?: number | null
          google_calendar_id?: string | null
          id?: string
          operacao_id?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_compromissos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_compromissos_cliente_pj_id_fkey"
            columns: ["cliente_pj_id"]
            isOneToOne: false
            referencedRelation: "clientes_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_compromissos_operacao_id_fkey"
            columns: ["operacao_id"]
            isOneToOne: false
            referencedRelation: "crm_operacoes"
            referencedColumns: ["id"]
          },
        ]
      }
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
      category_memory: {
        Row: {
          category: string
          hit_count: number
          id: string
          keyword: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          hit_count?: number
          id?: string
          keyword: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          hit_count?: number
          id?: string
          keyword?: string
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
      clientes_pj: {
        Row: {
          atividade: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          google_drive_url: string | null
          id: string
          nome: string
          observacoes: string | null
          razao_social: string | null
          responsavel: string | null
          segmento: string | null
          status: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          atividade?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          google_drive_url?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          razao_social?: string | null
          responsavel?: string | null
          segmento?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          atividade?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          google_drive_url?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          razao_social?: string | null
          responsavel?: string | null
          segmento?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
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
      crm_clientes: {
        Row: {
          banco: string | null
          cidade: string | null
          comissao_indicador: string | null
          comissao_percentual: number | null
          comissao_tipo: string | null
          conjuge_cidade: string | null
          conjuge_cpf: string | null
          conjuge_data_nascimento: string | null
          conjuge_email: string | null
          conjuge_endereco: string | null
          conjuge_estado: string | null
          conjuge_nome: string | null
          conjuge_telefone: string | null
          cpf: string | null
          created_at: string | null
          data_entrada: string | null
          data_indicacao: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          estado_civil: string | null
          formalizacao_renda: string | null
          google_drive_url: string | null
          honorarios_iniciais: number | null
          id: string
          indicacao: string | null
          nome: string
          observacoes: string | null
          perfil_renda: string | null
          produto: string | null
          profissao: string | null
          regime_casamento: string | null
          rg: string | null
          status: Database["public"]["Enums"]["crm_pipeline_status"] | null
          subproduto: string | null
          telefones: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
          valor: number | null
        }
        Insert: {
          banco?: string | null
          cidade?: string | null
          comissao_indicador?: string | null
          comissao_percentual?: number | null
          comissao_tipo?: string | null
          conjuge_cidade?: string | null
          conjuge_cpf?: string | null
          conjuge_data_nascimento?: string | null
          conjuge_email?: string | null
          conjuge_endereco?: string | null
          conjuge_estado?: string | null
          conjuge_nome?: string | null
          conjuge_telefone?: string | null
          cpf?: string | null
          created_at?: string | null
          data_entrada?: string | null
          data_indicacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          formalizacao_renda?: string | null
          google_drive_url?: string | null
          honorarios_iniciais?: number | null
          id?: string
          indicacao?: string | null
          nome: string
          observacoes?: string | null
          perfil_renda?: string | null
          produto?: string | null
          profissao?: string | null
          regime_casamento?: string | null
          rg?: string | null
          status?: Database["public"]["Enums"]["crm_pipeline_status"] | null
          subproduto?: string | null
          telefones?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
          valor?: number | null
        }
        Update: {
          banco?: string | null
          cidade?: string | null
          comissao_indicador?: string | null
          comissao_percentual?: number | null
          comissao_tipo?: string | null
          conjuge_cidade?: string | null
          conjuge_cpf?: string | null
          conjuge_data_nascimento?: string | null
          conjuge_email?: string | null
          conjuge_endereco?: string | null
          conjuge_estado?: string | null
          conjuge_nome?: string | null
          conjuge_telefone?: string | null
          cpf?: string | null
          created_at?: string | null
          data_entrada?: string | null
          data_indicacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          formalizacao_renda?: string | null
          google_drive_url?: string | null
          honorarios_iniciais?: number | null
          id?: string
          indicacao?: string | null
          nome?: string
          observacoes?: string | null
          perfil_renda?: string | null
          produto?: string | null
          profissao?: string | null
          regime_casamento?: string | null
          rg?: string | null
          status?: Database["public"]["Enums"]["crm_pipeline_status"] | null
          subproduto?: string | null
          telefones?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
          valor?: number | null
        }
        Relationships: []
      }
      crm_clientes_master: {
        Row: {
          ativo: boolean
          cep: string | null
          checklist_documental: Json
          cidade: string | null
          cnpj: string | null
          cpf: string | null
          cpf_conjuge: string | null
          created_at: string
          data_nascimento: string | null
          data_nascimento_conjuge: string | null
          email_conjuge: string | null
          email_principal: string | null
          empresas_relacionadas: string | null
          endereco: string | null
          estado: string | null
          estado_civil: string | null
          estrategia_resumo: string | null
          formalizacao_renda: string | null
          funcao_empresarial: string | null
          garantias_resumo: string | null
          google_drive_url: string | null
          grupo_economico: string | null
          id: string
          legacy_crm_cliente_id: string | null
          nacionalidade: string | null
          nome: string
          nome_conjuge: string | null
          notas_renda: string | null
          origem_canal: string | null
          origem_parceiro: string | null
          participacao_societaria: string | null
          patrimonio_resumo: string | null
          perfil_renda: string | null
          profissao: string | null
          regime_bens: string | null
          relacionamentos_bancarios: string | null
          renda_declarada: number | null
          renda_percebida: number | null
          rg_ie: string | null
          riscos_observacoes: string | null
          sazonalidade: string | null
          telefone_conjuge: string | null
          telefone_principal: string | null
          telefone_secundario: string | null
          tipo_pessoa: Database["public"]["Enums"]["crm_tipo_pessoa"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          checklist_documental?: Json
          cidade?: string | null
          cnpj?: string | null
          cpf?: string | null
          cpf_conjuge?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_nascimento_conjuge?: string | null
          email_conjuge?: string | null
          email_principal?: string | null
          empresas_relacionadas?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          estrategia_resumo?: string | null
          formalizacao_renda?: string | null
          funcao_empresarial?: string | null
          garantias_resumo?: string | null
          google_drive_url?: string | null
          grupo_economico?: string | null
          id?: string
          legacy_crm_cliente_id?: string | null
          nacionalidade?: string | null
          nome: string
          nome_conjuge?: string | null
          notas_renda?: string | null
          origem_canal?: string | null
          origem_parceiro?: string | null
          participacao_societaria?: string | null
          patrimonio_resumo?: string | null
          perfil_renda?: string | null
          profissao?: string | null
          regime_bens?: string | null
          relacionamentos_bancarios?: string | null
          renda_declarada?: number | null
          renda_percebida?: number | null
          rg_ie?: string | null
          riscos_observacoes?: string | null
          sazonalidade?: string | null
          telefone_conjuge?: string | null
          telefone_principal?: string | null
          telefone_secundario?: string | null
          tipo_pessoa?: Database["public"]["Enums"]["crm_tipo_pessoa"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          checklist_documental?: Json
          cidade?: string | null
          cnpj?: string | null
          cpf?: string | null
          cpf_conjuge?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_nascimento_conjuge?: string | null
          email_conjuge?: string | null
          email_principal?: string | null
          empresas_relacionadas?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          estrategia_resumo?: string | null
          formalizacao_renda?: string | null
          funcao_empresarial?: string | null
          garantias_resumo?: string | null
          google_drive_url?: string | null
          grupo_economico?: string | null
          id?: string
          legacy_crm_cliente_id?: string | null
          nacionalidade?: string | null
          nome?: string
          nome_conjuge?: string | null
          notas_renda?: string | null
          origem_canal?: string | null
          origem_parceiro?: string | null
          participacao_societaria?: string | null
          patrimonio_resumo?: string | null
          perfil_renda?: string | null
          profissao?: string | null
          regime_bens?: string | null
          relacionamentos_bancarios?: string | null
          renda_declarada?: number | null
          renda_percebida?: number | null
          rg_ie?: string | null
          riscos_observacoes?: string | null
          sazonalidade?: string | null
          telefone_conjuge?: string | null
          telefone_principal?: string | null
          telefone_secundario?: string | null
          tipo_pessoa?: Database["public"]["Enums"]["crm_tipo_pessoa"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_clientes_master_legacy_crm_cliente_id_fkey"
            columns: ["legacy_crm_cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_historico: {
        Row: {
          cliente_id: string
          created_at: string | null
          descricao: string | null
          id: string
          status_anterior: string | null
          status_novo: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          status_anterior?: string | null
          status_novo?: string | null
          tipo?: string
          titulo: string
          user_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          status_anterior?: string | null
          status_novo?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_historico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_operacao_eventos: {
        Row: {
          cliente_id: string | null
          created_at: string
          descricao: string | null
          id: string
          metadata: Json
          operacao_id: string
          prazo: string | null
          status_anterior:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          status_novo: Database["public"]["Enums"]["crm_operacao_status"] | null
          tipo: Database["public"]["Enums"]["crm_evento_tipo"]
          titulo: string
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json
          operacao_id: string
          prazo?: string | null
          status_anterior?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          status_novo?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          tipo?: Database["public"]["Enums"]["crm_evento_tipo"]
          titulo: string
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json
          operacao_id?: string
          prazo?: string | null
          status_anterior?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          status_novo?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          tipo?: Database["public"]["Enums"]["crm_evento_tipo"]
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_operacao_eventos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_operacao_eventos_operacao_id_fkey"
            columns: ["operacao_id"]
            isOneToOne: false
            referencedRelation: "crm_operacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_operacoes: {
        Row: {
          ativo: boolean
          banco_alvo: string | null
          categoria_produto: string
          cliente_id: string
          created_at: string
          data_entrada: string
          data_previsao_fechamento: string | null
          descricao: string | null
          drive_url: string | null
          fee_sucesso_gatilho_status:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          fee_sucesso_percentual: number | null
          fee_sucesso_tipo:
            | Database["public"]["Enums"]["crm_tipo_fee_sucesso"]
            | null
          fee_sucesso_valor: number | null
          honorarios_data_vencimento: string | null
          honorarios_iniciais: number | null
          id: string
          indicador_nome: string | null
          legacy_crm_cliente_id: string | null
          mensalidade_frequencia: string | null
          mensalidade_inicio: string | null
          mensalidade_quantidade: number | null
          mensalidade_valor: number | null
          modelo_cobranca:
            | Database["public"]["Enums"]["crm_modelo_cobranca"]
            | null
          observacoes_internas: string | null
          origem_lead: string | null
          parcelas_fixas_quantidade: number | null
          parcelas_fixas_valor: number | null
          prioridade: Database["public"]["Enums"]["crm_prioridade"]
          produto: string
          proxima_acao: string | null
          proxima_acao_data: string | null
          responsavel_user_id: string | null
          risco: Database["public"]["Enums"]["crm_risco"]
          status: Database["public"]["Enums"]["crm_operacao_status"]
          subproduto: string | null
          titulo: string
          updated_at: string
          user_id: string
          valor_aprovado: number | null
          valor_objetivo: number | null
        }
        Insert: {
          ativo?: boolean
          banco_alvo?: string | null
          categoria_produto: string
          cliente_id: string
          created_at?: string
          data_entrada?: string
          data_previsao_fechamento?: string | null
          descricao?: string | null
          drive_url?: string | null
          fee_sucesso_gatilho_status?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          fee_sucesso_percentual?: number | null
          fee_sucesso_tipo?:
            | Database["public"]["Enums"]["crm_tipo_fee_sucesso"]
            | null
          fee_sucesso_valor?: number | null
          honorarios_data_vencimento?: string | null
          honorarios_iniciais?: number | null
          id?: string
          indicador_nome?: string | null
          legacy_crm_cliente_id?: string | null
          mensalidade_frequencia?: string | null
          mensalidade_inicio?: string | null
          mensalidade_quantidade?: number | null
          mensalidade_valor?: number | null
          modelo_cobranca?:
            | Database["public"]["Enums"]["crm_modelo_cobranca"]
            | null
          observacoes_internas?: string | null
          origem_lead?: string | null
          parcelas_fixas_quantidade?: number | null
          parcelas_fixas_valor?: number | null
          prioridade?: Database["public"]["Enums"]["crm_prioridade"]
          produto: string
          proxima_acao?: string | null
          proxima_acao_data?: string | null
          responsavel_user_id?: string | null
          risco?: Database["public"]["Enums"]["crm_risco"]
          status?: Database["public"]["Enums"]["crm_operacao_status"]
          subproduto?: string | null
          titulo: string
          updated_at?: string
          user_id: string
          valor_aprovado?: number | null
          valor_objetivo?: number | null
        }
        Update: {
          ativo?: boolean
          banco_alvo?: string | null
          categoria_produto?: string
          cliente_id?: string
          created_at?: string
          data_entrada?: string
          data_previsao_fechamento?: string | null
          descricao?: string | null
          drive_url?: string | null
          fee_sucesso_gatilho_status?:
            | Database["public"]["Enums"]["crm_operacao_status"]
            | null
          fee_sucesso_percentual?: number | null
          fee_sucesso_tipo?:
            | Database["public"]["Enums"]["crm_tipo_fee_sucesso"]
            | null
          fee_sucesso_valor?: number | null
          honorarios_data_vencimento?: string | null
          honorarios_iniciais?: number | null
          id?: string
          indicador_nome?: string | null
          legacy_crm_cliente_id?: string | null
          mensalidade_frequencia?: string | null
          mensalidade_inicio?: string | null
          mensalidade_quantidade?: number | null
          mensalidade_valor?: number | null
          modelo_cobranca?:
            | Database["public"]["Enums"]["crm_modelo_cobranca"]
            | null
          observacoes_internas?: string | null
          origem_lead?: string | null
          parcelas_fixas_quantidade?: number | null
          parcelas_fixas_valor?: number | null
          prioridade?: Database["public"]["Enums"]["crm_prioridade"]
          produto?: string
          proxima_acao?: string | null
          proxima_acao_data?: string | null
          responsavel_user_id?: string | null
          risco?: Database["public"]["Enums"]["crm_risco"]
          status?: Database["public"]["Enums"]["crm_operacao_status"]
          subproduto?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
          valor_aprovado?: number | null
          valor_objetivo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_operacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_operacoes_legacy_crm_cliente_id_fkey"
            columns: ["legacy_crm_cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_recebiveis: {
        Row: {
          cliente_id: string
          created_at: string
          data_competencia: string | null
          data_pagamento: string | null
          data_vencimento: string
          descricao: string | null
          evento_gatilho: string | null
          id: string
          operacao_id: string
          origem_automatica: boolean
          parcela_atual: number | null
          parcelas_total: number | null
          status: Database["public"]["Enums"]["crm_recebivel_status"]
          tipo: Database["public"]["Enums"]["crm_recebivel_tipo"]
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_competencia?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          descricao?: string | null
          evento_gatilho?: string | null
          id?: string
          operacao_id: string
          origem_automatica?: boolean
          parcela_atual?: number | null
          parcelas_total?: number | null
          status?: Database["public"]["Enums"]["crm_recebivel_status"]
          tipo: Database["public"]["Enums"]["crm_recebivel_tipo"]
          updated_at?: string
          user_id: string
          valor?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_competencia?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string | null
          evento_gatilho?: string | null
          id?: string
          operacao_id?: string
          origem_automatica?: boolean
          parcela_atual?: number | null
          parcelas_total?: number | null
          status?: Database["public"]["Enums"]["crm_recebivel_status"]
          tipo?: Database["public"]["Enums"]["crm_recebivel_tipo"]
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_recebiveis_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_clientes_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_recebiveis_operacao_id_fkey"
            columns: ["operacao_id"]
            isOneToOne: false
            referencedRelation: "crm_operacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          installment_current: number | null
          installment_group_id: string | null
          installment_total: number | null
          source: string
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
          installment_current?: number | null
          installment_group_id?: string | null
          installment_total?: number | null
          source?: string
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
          installment_current?: number | null
          installment_group_id?: string | null
          installment_total?: number | null
          source?: string
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
          lido: boolean
          mensagem: string | null
          nome: string
          origem: string
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
          lido?: boolean
          mensagem?: string | null
          nome: string
          origem?: string
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
          lido?: boolean
          mensagem?: string | null
          nome?: string
          origem?: string
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
      pj_historico: {
        Row: {
          cliente_pj_id: string
          created_at: string
          descricao: string | null
          id: string
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          cliente_pj_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          titulo: string
          user_id: string
        }
        Update: {
          cliente_pj_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pj_historico_cliente_pj_id_fkey"
            columns: ["cliente_pj_id"]
            isOneToOne: false
            referencedRelation: "clientes_pj"
            referencedColumns: ["id"]
          },
        ]
      }
      pj_recebimentos: {
        Row: {
          cliente_pj_id: string
          created_at: string
          data_inicio: string | null
          data_vencimento: string | null
          descricao: string | null
          frequencia: string
          id: string
          parcelas_pagas: number | null
          parcelas_total: number | null
          recorrente: boolean
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_pj_id: string
          created_at?: string
          data_inicio?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          frequencia?: string
          id?: string
          parcelas_pagas?: number | null
          parcelas_total?: number | null
          recorrente?: boolean
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente_pj_id?: string
          created_at?: string
          data_inicio?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          frequencia?: string
          id?: string
          parcelas_pagas?: number | null
          parcelas_total?: number | null
          recorrente?: boolean
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pj_recebimentos_cliente_pj_id_fkey"
            columns: ["cliente_pj_id"]
            isOneToOne: false
            referencedRelation: "clientes_pj"
            referencedColumns: ["id"]
          },
        ]
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
      recurring_entries: {
        Row: {
          active: boolean
          amount: number
          category: string
          created_at: string
          day_of_month: number
          description: string
          id: string
          last_generated_month: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount?: number
          category?: string
          created_at?: string
          day_of_month?: number
          description?: string
          id?: string
          last_generated_month?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          amount?: number
          category?: string
          created_at?: string
          day_of_month?: number
          description?: string
          id?: string
          last_generated_month?: string | null
          type?: string
          updated_at?: string
          user_id?: string
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
      whatsapp_links: {
        Row: {
          created_at: string
          id: string
          phone_e164: string
          user_id: string
          verification_code: string | null
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          phone_e164: string
          user_id: string
          verification_code?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          phone_e164?: string
          user_id?: string
          verification_code?: string | null
          verified?: boolean
          verified_at?: string | null
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
      crm_evento_tipo:
        | "nota"
        | "status"
        | "pendencia"
        | "documento"
        | "financeiro"
        | "agenda"
        | "sistema"
      crm_modelo_cobranca:
        | "honorarios_mensalidade"
        | "fee_sucesso"
        | "hibrido"
        | "fixo_parcelado"
      crm_operacao_status:
        | "lead_novo"
        | "contato_inicial"
        | "triagem"
        | "analise_inicial"
        | "analise_documental"
        | "viabilidade"
        | "proposta_enviada"
        | "em_negociacao"
        | "aprovado"
        | "em_fechamento"
        | "contrato_assinado"
        | "em_execucao"
        | "acompanhamento"
        | "concluido"
        | "cancelado"
        | "suspenso"
      crm_pipeline_status:
        | "prospeccao"
        | "analise_documental"
        | "em_negociacao"
        | "aprovado"
        | "em_fechamento"
        | "contrato_assinado"
        | "concluido"
        | "cancelado"
        | "analise_inicial"
        | "acompanhamento"
      crm_prioridade: "baixa" | "media" | "alta" | "critica"
      crm_recebivel_status:
        | "previsto"
        | "pendente"
        | "pago"
        | "vencido"
        | "cancelado"
      crm_recebivel_tipo:
        | "honorario_inicial"
        | "mensalidade"
        | "fee_sucesso"
        | "parcela_fixa"
        | "ajuste"
      crm_risco: "baixo" | "moderado" | "alto"
      crm_tipo_fee_sucesso: "percentual" | "fixo"
      crm_tipo_pessoa: "pf" | "pj"
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
      crm_evento_tipo: [
        "nota",
        "status",
        "pendencia",
        "documento",
        "financeiro",
        "agenda",
        "sistema",
      ],
      crm_modelo_cobranca: [
        "honorarios_mensalidade",
        "fee_sucesso",
        "hibrido",
        "fixo_parcelado",
      ],
      crm_operacao_status: [
        "lead_novo",
        "contato_inicial",
        "triagem",
        "analise_inicial",
        "analise_documental",
        "viabilidade",
        "proposta_enviada",
        "em_negociacao",
        "aprovado",
        "em_fechamento",
        "contrato_assinado",
        "em_execucao",
        "acompanhamento",
        "concluido",
        "cancelado",
        "suspenso",
      ],
      crm_pipeline_status: [
        "prospeccao",
        "analise_documental",
        "em_negociacao",
        "aprovado",
        "em_fechamento",
        "contrato_assinado",
        "concluido",
        "cancelado",
        "analise_inicial",
        "acompanhamento",
      ],
      crm_prioridade: ["baixa", "media", "alta", "critica"],
      crm_recebivel_status: [
        "previsto",
        "pendente",
        "pago",
        "vencido",
        "cancelado",
      ],
      crm_recebivel_tipo: [
        "honorario_inicial",
        "mensalidade",
        "fee_sucesso",
        "parcela_fixa",
        "ajuste",
      ],
      crm_risco: ["baixo", "moderado", "alto"],
      crm_tipo_fee_sucesso: ["percentual", "fixo"],
      crm_tipo_pessoa: ["pf", "pj"],
    },
  },
} as const
