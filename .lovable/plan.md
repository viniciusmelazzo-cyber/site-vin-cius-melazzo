

# Plano: Teste Completo e Proteção de Dados da Plataforma

## Problema Crítico Identificado

O componente `Onboarding.tsx` **nunca carrega dados existentes** do banco. O state começa sempre com `defaultOnboardingData` vazio. Se um cliente que já completou o onboarding for redirecionado para essa página por qualquer motivo, ou se salvou progresso e voltar depois, todos os dados aparecem em branco. Os dados existem no banco (tabela `onboarding_data`), mas o frontend não os recupera.

## O Que Será Feito

### 1. Carregar dados existentes do onboarding ao montar a página
- Adicionar `useEffect` no `Onboarding.tsx` que faz `select` na tabela `onboarding_data` filtrado pelo `user_id`
- Se existirem dados, popular o state `data` e restaurar o `onboarding_step` salvo
- Se o cliente já completou o onboarding (`profile.onboarding_completed === true`), redirecionar para o dashboard ao invés de mostrar o formulário novamente

### 2. Impedir que clientes com onboarding concluído acessem o onboarding novamente
- Ajustar o `ProtectedRoute` ou o próprio `Onboarding.tsx` para redirecionar clientes que já completaram o processo

### 3. Teste de responsividade — ajustes no layout
- Revisar `ClientLayout.tsx` (sidebar mobile já funciona com toggle)
- Revisar tabelas em `Lancamentos`, `Documentos` e `AdminDashboard` para scroll horizontal em mobile
- Revisar formulários do onboarding para telas pequenas (320px–414px)
- Revisar a landing page (`Index.tsx`) em mobile

### 4. Teste funcional completo via browser
- Login como admin → verificar dashboard, convites, detalhe do cliente
- Login como cliente → verificar dashboard, lançamentos CRUD, documentos upload/download, configurações
- Verificar fluxo de registro com convite
- Verificar notificações de onboarding

## Detalhes Técnicos

**Arquivo principal a alterar:** `src/pages/cliente/Onboarding.tsx`

Adicionar ao montar o componente:
```typescript
useEffect(() => {
  if (!user) return;
  const loadExisting = async () => {
    const { data: existing } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (existing) {
      setData({
        personal_data: existing.personal_data || {},
        activity_type: existing.activity_type || "",
        income_data: existing.income_data || {},
        housing_data: existing.housing_data || {},
        expenses_data: existing.expenses_data || {},
        assets_liabilities_data: existing.assets_liabilities_data || {},
        profile_module_data: existing.profile_module_data || {},
      });
      setStep(existing.onboarding_step || 0);
    }
  };
  loadExisting();
}, [user]);
```

**Responsividade:** Adicionar `overflow-x-auto` nas tabelas de Lançamentos, Documentos e Admin. Ajustar grids para `grid-cols-1` em mobile onde necessário.

## Garantia de Integridade dos Dados

- Nenhuma migração de banco será executada que altere ou remova colunas existentes
- Todos os dados JSONB existentes (`personal_data`, `income_data`, etc.) permanecem intactos
- O código apenas adiciona leitura — nunca sobrescreve dados sem ação explícita do usuário
- O `upsert` com `onConflict: "user_id"` já garante que dados são atualizados, nunca duplicados

