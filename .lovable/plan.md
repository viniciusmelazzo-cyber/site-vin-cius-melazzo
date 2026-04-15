

# Plano Definitivo: CRM Credito na Area Admin Melazzo

## Confirmacao de Escopo

**O que sera copiado:** Apenas a ESTRUTURA (codigo dos componentes, logica de negocio, constantes, tabelas).
**O que NAO sera copiado:** Nenhum dado de cliente, nenhum registro do banco da Life, nenhuma imagem/logo da Life.
**O que NAO muda:** Toda a area do cliente (dashboard, lancamentos, patrimonio, orcamento, documentos, onboarding) permanece intacta.

## Adaptacoes para Identidade Visual Melazzo

O projeto Life usa classes genericas (`bg-primary`, `text-foreground`, `glass-card`). Como o Melazzo ja define essas variaveis CSS com a paleta Navy/Gold/Linen, os componentes herdarao automaticamente a identidade visual correta ao serem copiados. Ajustes pontuais:

- Substituir qualquer referencia a "Life" por "Melazzo"
- O campo `full_name` do Melazzo substitui o `nome` da Life nos hooks
- O `AdminPanel.tsx` da Life NAO sera copiado (Melazzo ja tem seu proprio sistema de convites e gestao de usuarios)
- A geracao de contratos (`generate-contract` edge function) NAO sera incluida neste momento — pode ser adicionada depois
- Os status badges usarao cores Tailwind padrao (amber, blue, emerald, etc.) que harmonizam com a paleta Melazzo

## Execucao

### 1. Migracao SQL — Tabelas CRM

Criar as tabelas `crm_clientes` e `crm_historico` (prefixo `crm_` para evitar conflito com a tabela `profiles`/clientes existentes):

```text
CREATE TYPE crm_pipeline_status AS ENUM (
  'prospeccao','analise_documental','em_negociacao','aprovado',
  'em_fechamento','contrato_assinado','concluido','cancelado',
  'analise_inicial','acompanhamento'
);

CREATE TABLE crm_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL,
  cpf text, rg text, profissao text, telefones text, email text,
  endereco text, cidade text, estado text,
  data_nascimento text, estado_civil text, regime_casamento text,
  conjuge_nome text, conjuge_cpf text, conjuge_data_nascimento text,
  conjuge_telefone text, conjuge_email text, conjuge_endereco text,
  conjuge_cidade text, conjuge_estado text,
  perfil_renda text, formalizacao_renda text,
  produto text, subproduto text, banco text,
  valor numeric, status crm_pipeline_status DEFAULT 'prospeccao',
  comissao_tipo text, comissao_percentual numeric, honorarios_iniciais numeric,
  data_entrada text, data_indicacao text,
  indicacao text, comissao_indicador text,
  google_drive_url text, observacoes text,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE crm_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES crm_clientes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo text NOT NULL DEFAULT 'nota',
  titulo text NOT NULL,
  descricao text,
  status_anterior text,
  status_novo text,
  created_at timestamptz DEFAULT now()
);

-- RLS: somente admins
ALTER TABLE crm_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_crm_clientes" ON crm_clientes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_crm_historico" ON crm_historico
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

### 2. Instalar dependencia

Adicionar `@hello-pangea/dnd` ao `package.json` (drag-and-drop do Kanban).

### 3. Criar arquivos de suporte

**`src/lib/crm-constants.ts`** — Copiar constantes da Life (`PIPELINE_STATUSES`, `CONSULTORIA_STATUSES`, `KANBAN_STATUSES`, `PRODUTO_OPTIONS`, `SUBPRODUTO_MAP`, `ESTADO_CIVIL_OPTIONS`, `PERFIL_RENDA_OPTIONS`, `FORMALIZACAO_RENDA_OPTIONS`, `COMISSAO_TIPO_OPTIONS`, `ESTADOS_BR`, `formatCurrency`, `formatDate`, `getStatusConfig`).

**`src/hooks/useCrmClientes.ts`** — Adaptar `useClientes` e `useHistorico` da Life para apontar para `crm_clientes` e `crm_historico`. Usar tipos locais (nao importar de `Database` ate o types.ts ser regenerado).

### 4. Copiar e adaptar componentes CRM

Criar `src/components/crm/` com 9 arquivos adaptados:

| Arquivo | Origem Life | Adaptacao |
|---------|-------------|-----------|
| `StatusBadge.tsx` | Identico | Import de `crm-constants` |
| `CrmDashboard.tsx` | `Dashboard.tsx` | Tipos locais, import crm-constants |
| `ClientesList.tsx` | Identico | Import crm-constants |
| `KanbanBoard.tsx` | Identico | Remover `useProfiles`, usar `useAuth` |
| `ContratosAssinados.tsx` | Identico | Import crm-constants |
| `ConsultoriaFinanceira.tsx` | Identico | Remover `useProfiles`, usar `useAuth` |
| `Finalizados.tsx` | Identico | Import crm-constants |
| `ClienteForm.tsx` | Identico | Import crm-constants, status como string |
| `ClienteDetail.tsx` | Remover geracao de contrato | Simplificar, sem edge function |

### 5. Criar pagina AdminCRM

**`src/pages/cliente/AdminCRM.tsx`** — Adaptar `CrmLayout.tsx` da Life para funcionar DENTRO do `ClientLayout` admin (sem sidebar proprio, apenas abas internas: Dashboard, Clientes, Pipeline, Contratos, Consultoria, Finalizados).

### 6. Expandir sidebar e rotas

**`src/components/ClientLayout.tsx`** — Adicionar "CRM Credito" nos `adminLinks` com icone `Briefcase` apontando para `/cliente/admin/crm`.

**`src/App.tsx`** — Adicionar rota protegida: `/cliente/admin/crm` → `AdminCRM`.

## Arquivos Criados (12)

- `src/lib/crm-constants.ts`
- `src/hooks/useCrmClientes.ts`
- `src/components/crm/StatusBadge.tsx`
- `src/components/crm/CrmDashboard.tsx`
- `src/components/crm/ClientesList.tsx`
- `src/components/crm/KanbanBoard.tsx`
- `src/components/crm/ContratosAssinados.tsx`
- `src/components/crm/ConsultoriaFinanceira.tsx`
- `src/components/crm/Finalizados.tsx`
- `src/components/crm/ClienteForm.tsx`
- `src/components/crm/ClienteDetail.tsx`
- `src/pages/cliente/AdminCRM.tsx`

## Arquivos Modificados (3)

- `src/components/ClientLayout.tsx` — link CRM no sidebar admin
- `src/App.tsx` — rota `/cliente/admin/crm`
- `package.json` — `@hello-pangea/dnd`

## Tabelas Existentes Afetadas: ZERO

Nenhuma tabela existente sera alterada. Apenas duas tabelas novas com prefixo `crm_` e um enum novo.

