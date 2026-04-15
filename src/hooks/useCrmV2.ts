import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  type CrmClienteMaster,
  type CrmCompromisso,
  type CrmDashboardMetrics,
  type CrmEvento,
  type CrmModeloCobranca,
  type CrmOperacao,
  type CrmRecebivel,
  type CrmRecebivelTipo,
  isStatusAtivo,
  normalizeRecebivelStatus,
  startOfMonth,
  endOfMonth,
} from "@/lib/crm-v2";

const db = supabase as any;

function safeNumber(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIsoDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 10);
}

function buildAutoReceivables(operation: Partial<CrmOperacao> & { id: string; cliente_id: string; user_id: string }): Array<Partial<CrmRecebivel>> {
  const items: Array<Partial<CrmRecebivel>> = [];
  const modelo = operation.modelo_cobranca as CrmModeloCobranca | undefined | null;
  const titleBase = `${operation.produto || "Operação"} — ${operation.titulo || "Card"}`;

  if (!modelo) return items;

  if (["honorarios_mensalidade", "hibrido"].includes(modelo) && safeNumber(operation.honorarios_iniciais) > 0 && operation.honorarios_data_vencimento) {
    items.push({
      user_id: operation.user_id,
      cliente_id: operation.cliente_id,
      operacao_id: operation.id,
      tipo: "honorario_inicial",
      status: "pendente",
      descricao: `Honorário inicial — ${titleBase}`,
      valor: safeNumber(operation.honorarios_iniciais),
      data_competencia: toIsoDate(operation.honorarios_data_vencimento),
      data_vencimento: toIsoDate(operation.honorarios_data_vencimento),
      origem_automatica: true,
      evento_gatilho: "criacao_operacao",
    });
  }

  if (["honorarios_mensalidade", "hibrido"].includes(modelo) && safeNumber(operation.mensalidade_valor) > 0 && operation.mensalidade_inicio) {
    const total = Math.max(1, safeNumber(operation.mensalidade_quantidade || 1));
    for (let index = 0; index < total; index += 1) {
      const due = new Date(operation.mensalidade_inicio);
      due.setMonth(due.getMonth() + index);
      const iso = due.toISOString().slice(0, 10);
      items.push({
        user_id: operation.user_id,
        cliente_id: operation.cliente_id,
        operacao_id: operation.id,
        tipo: "mensalidade",
        status: "pendente",
        descricao: `Mensalidade ${index + 1}/${total} — ${titleBase}`,
        valor: safeNumber(operation.mensalidade_valor),
        data_competencia: iso,
        data_vencimento: iso,
        origem_automatica: true,
        evento_gatilho: "plano_mensalidade",
        parcela_atual: index + 1,
        parcelas_total: total,
      });
    }
  }

  if (modelo === "fixo_parcelado" && safeNumber(operation.parcelas_fixas_valor) > 0 && safeNumber(operation.parcelas_fixas_quantidade) > 0) {
    const total = Math.max(1, safeNumber(operation.parcelas_fixas_quantidade));
    const baseDate = operation.data_entrada ? new Date(operation.data_entrada) : new Date();
    for (let index = 0; index < total; index += 1) {
      const due = new Date(baseDate);
      due.setMonth(due.getMonth() + index);
      const iso = due.toISOString().slice(0, 10);
      items.push({
        user_id: operation.user_id,
        cliente_id: operation.cliente_id,
        operacao_id: operation.id,
        tipo: "parcela_fixa",
        status: "pendente",
        descricao: `Parcela ${index + 1}/${total} — ${titleBase}`,
        valor: safeNumber(operation.parcelas_fixas_valor),
        data_competencia: iso,
        data_vencimento: iso,
        origem_automatica: true,
        evento_gatilho: "parcelamento_fixo",
        parcela_atual: index + 1,
        parcelas_total: total,
      });
    }
  }

  const successStatus = operation.fee_sucesso_gatilho_status || "concluido";
  const shouldCreateSuccess = ["fee_sucesso", "hibrido"].includes(modelo) && operation.status === successStatus;
  if (shouldCreateSuccess) {
    const value = operation.fee_sucesso_tipo === "percentual"
      ? safeNumber(operation.valor_aprovado) * (safeNumber(operation.fee_sucesso_percentual) / 100)
      : safeNumber(operation.fee_sucesso_valor);

    if (value > 0) {
      const due = toIsoDate(operation.data_previsao_fechamento || operation.data_entrada || new Date().toISOString());
      items.push({
        user_id: operation.user_id,
        cliente_id: operation.cliente_id,
        operacao_id: operation.id,
        tipo: "fee_sucesso",
        status: "pendente",
        descricao: `Fee de sucesso — ${titleBase}`,
        valor: value,
        data_competencia: due,
        data_vencimento: due,
        origem_automatica: true,
        evento_gatilho: "fee_sucesso",
      });
    }
  }

  return items;
}

export function useCrmV2() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<CrmClienteMaster[]>([]);
  const [operacoes, setOperacoes] = useState<CrmOperacao[]>([]);
  const [recebiveis, setRecebiveis] = useState<CrmRecebivel[]>([]);
  const [eventos, setEventos] = useState<CrmEvento[]>([]);
  const [compromissos, setCompromissos] = useState<CrmCompromisso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [clientesRes, operacoesRes, recebiveisRes, eventosRes, compromissosRes] = await Promise.all([
      db.from("crm_clientes_master").select("*").order("nome", { ascending: true }),
      db.from("crm_operacoes").select("*").order("created_at", { ascending: false }),
      db.from("crm_recebiveis").select("*").order("data_vencimento", { ascending: true }),
      db.from("crm_operacao_eventos").select("*").order("created_at", { ascending: false }),
      db.from("admin_compromissos").select("*").order("data_hora", { ascending: true }),
    ]);

    const firstError = clientesRes.error || operacoesRes.error || recebiveisRes.error || eventosRes.error || compromissosRes.error;

    if (firstError) {
      toast({ title: "Erro ao carregar CRM", description: firstError.message, variant: "destructive" });
    } else {
      setClientes((clientesRes.data || []) as CrmClienteMaster[]);
      setOperacoes((operacoesRes.data || []) as CrmOperacao[]);
      setRecebiveis((recebiveisRes.data || []) as CrmRecebivel[]);
      setEventos((eventosRes.data || []) as CrmEvento[]);
      setCompromissos((compromissosRes.data || []) as CrmCompromisso[]);
    }
    setLoading(false);
  }, [toast, user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addEvento = useCallback(async (payload: Partial<CrmEvento>) => {
    if (!user) return null;
    const { data, error } = await db.from("crm_operacao_eventos").insert({
      user_id: user.id,
      ...payload,
    }).select().single();

    if (error) {
      toast({ title: "Erro ao registrar evento", description: error.message, variant: "destructive" });
      return null;
    }

    setEventos((current) => [data as CrmEvento, ...current]);
    return data as CrmEvento;
  }, [toast, user]);

  const syncRecebiveisOperacao = useCallback(async (operationInput: Partial<CrmOperacao> & { id: string; cliente_id: string; user_id: string }) => {
    const autoOpenStatuses = ["pendente", "previsto", "vencido"];
    await db
      .from("crm_recebiveis")
      .delete()
      .eq("operacao_id", operationInput.id)
      .eq("origem_automatica", true)
      .in("status", autoOpenStatuses);

    const items = buildAutoReceivables(operationInput);
    if (items.length) {
      const { error } = await db.from("crm_recebiveis").insert(items);
      if (error) {
        toast({ title: "Erro ao sincronizar recebíveis", description: error.message, variant: "destructive" });
      }
    }
  }, [toast]);

  const createCliente = useCallback(async (payload: Partial<CrmClienteMaster>) => {
    if (!user) return null;
    const { data, error } = await db.from("crm_clientes_master").insert({
      user_id: user.id,
      ativo: true,
      ...payload,
    }).select().single();

    if (error) {
      toast({ title: "Erro ao criar cliente", description: error.message, variant: "destructive" });
      return null;
    }

    toast({ title: "Cliente criado com sucesso" });
    await fetchAll();
    return data as CrmClienteMaster;
  }, [fetchAll, toast, user]);

  const updateCliente = useCallback(async (id: string, payload: Partial<CrmClienteMaster>) => {
    const { error } = await db.from("crm_clientes_master").update(payload).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar cliente", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Cliente atualizado" });
    await fetchAll();
    return true;
  }, [fetchAll, toast]);

  const createOperacao = useCallback(async (payload: Partial<CrmOperacao>) => {
    if (!user) return null;
    const { data, error } = await db.from("crm_operacoes").insert({
      user_id: user.id,
      ativo: true,
      status: "lead_novo",
      prioridade: "media",
      risco: "moderado",
      data_entrada: new Date().toISOString().slice(0, 10),
      ...payload,
    }).select().single();

    if (error) {
      toast({ title: "Erro ao criar operação", description: error.message, variant: "destructive" });
      return null;
    }

    await syncRecebiveisOperacao(data as CrmOperacao);
    await addEvento({
      cliente_id: data.cliente_id,
      operacao_id: data.id,
      tipo: "sistema",
      titulo: "Operação criada",
      descricao: `Operação ${data.titulo} criada no CRM.`,
    });
    toast({ title: "Operação criada com sucesso" });
    await fetchAll();
    return data as CrmOperacao;
  }, [addEvento, fetchAll, syncRecebiveisOperacao, toast, user]);

  const updateOperacao = useCallback(async (id: string, payload: Partial<CrmOperacao>) => {
    const current = operacoes.find((item) => item.id === id);
    const { data, error } = await db.from("crm_operacoes").update(payload).eq("id", id).select().single();
    if (error) {
      toast({ title: "Erro ao atualizar operação", description: error.message, variant: "destructive" });
      return null;
    }

    const updated = data as CrmOperacao;
    await syncRecebiveisOperacao(updated);

    if (current && current.status !== updated.status) {
      await addEvento({
        cliente_id: updated.cliente_id,
        operacao_id: updated.id,
        tipo: "status",
        titulo: "Mudança de status",
        descricao: `Status alterado para ${updated.status}.`,
        status_anterior: current.status,
        status_novo: updated.status,
      });
    }

    toast({ title: "Operação atualizada" });
    await fetchAll();
    return updated;
  }, [addEvento, fetchAll, operacoes, syncRecebiveisOperacao, toast]);

  const updateOperacaoStatus = useCallback(async (id: string, status: CrmOperacao["status"]) => {
    return updateOperacao(id, { status });
  }, [updateOperacao]);

  const createCompromisso = useCallback(async (payload: Partial<CrmCompromisso>) => {
    if (!user) return null;
    const { data, error } = await db.from("admin_compromissos").insert({
      user_id: user.id,
      status: "agendado",
      ...payload,
    }).select().single();
    if (error) {
      toast({ title: "Erro ao criar compromisso", description: error.message, variant: "destructive" });
      return null;
    }

    if (data.operacao_id) {
      const operacao = operacoes.find((item) => item.id === data.operacao_id);
      await addEvento({
        cliente_id: operacao?.cliente_id,
        operacao_id: data.operacao_id,
        tipo: "agenda",
        titulo: "Compromisso agendado",
        descricao: data.titulo,
        prazo: data.data_hora,
      });
    }

    toast({ title: "Compromisso criado" });
    await fetchAll();
    return data as CrmCompromisso;
  }, [addEvento, fetchAll, operacoes, toast, user]);

  const updateCompromisso = useCallback(async (id: string, payload: Partial<CrmCompromisso>) => {
    const { error } = await db.from("admin_compromissos").update(payload).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar compromisso", description: error.message, variant: "destructive" });
      return false;
    }
    await fetchAll();
    return true;
  }, [fetchAll, toast]);

  const updateRecebivel = useCallback(async (id: string, payload: Partial<CrmRecebivel>) => {
    const { error } = await db.from("crm_recebiveis").update(payload).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar recebível", description: error.message, variant: "destructive" });
      return false;
    }
    await fetchAll();
    return true;
  }, [fetchAll, toast]);

  const clientesMap = useMemo(() => Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente])), [clientes]);

  const operacoesAtivas = useMemo(() => operacoes.filter((operacao) => isStatusAtivo(operacao.status)), [operacoes]);

  const recebiveisNormalizados = useMemo(
    () => recebiveis.map((item) => ({ ...item, status: normalizeRecebivelStatus(item.status, item.data_vencimento) })),
    [recebiveis]
  );

  const dashboardMetrics = useMemo<CrmDashboardMetrics>(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);

    const clientesAtivosSet = new Set(operacoesAtivas.map((operacao) => operacao.cliente_id));
    const aReceberMes = recebiveisNormalizados
      .filter((item) => {
        const due = new Date(item.data_vencimento);
        return due >= monthStart && due <= monthEnd && item.status !== "cancelado" && item.status !== "pago";
      })
      .reduce((sum, item) => sum + safeNumber(item.valor), 0);

    const recebidoMes = recebiveisNormalizados
      .filter((item) => item.status === "pago" && item.data_pagamento)
      .filter((item) => {
        const paid = new Date(item.data_pagamento as string);
        return paid >= monthStart && paid <= monthEnd;
      })
      .reduce((sum, item) => sum + safeNumber(item.valor), 0);

    const emAtraso = recebiveisNormalizados
      .filter((item) => item.status === "vencido")
      .reduce((sum, item) => sum + safeNumber(item.valor), 0);

    const compromissosAmanha = compromissos.filter((item) => item.data_hora?.slice(0, 10) === tomorrowIso && item.status !== "cancelado").length;
    const projetosCriticos = operacoesAtivas.filter((operacao) => operacao.prioridade === "critica" || operacao.risco === "alto").length;

    return {
      clientesAtivos: clientesAtivosSet.size,
      operacoesAndamento: operacoesAtivas.length,
      aReceberMes,
      recebidoMes,
      emAtraso,
      compromissosAmanha,
      projetosCriticos,
    };
  }, [compromissos, operacoesAtivas, recebiveisNormalizados]);

  const produtosAtivos = useMemo(() => {
    const grouped = operacoesAtivas.reduce<Record<string, { operacoes: number; clientes: Set<string>; valor: number }>>((acc, operacao) => {
      const key = operacao.produto || "Sem produto";
      if (!acc[key]) acc[key] = { operacoes: 0, clientes: new Set<string>(), valor: 0 };
      acc[key].operacoes += 1;
      acc[key].clientes.add(operacao.cliente_id);
      acc[key].valor += safeNumber(operacao.valor_objetivo || operacao.valor_aprovado);
      return acc;
    }, {});

    return Object.entries(grouped).map(([produto, data]) => ({
      produto,
      operacoes: data.operacoes,
      clientes: data.clientes.size,
      valor: data.valor,
    })).sort((a, b) => b.operacoes - a.operacoes);
  }, [operacoesAtivas]);

  const pipeline = useMemo(() => {
    const grouped = operacoesAtivas.reduce<Record<string, number>>((acc, operacao) => {
      acc[operacao.status] = (acc[operacao.status] || 0) + 1;
      return acc;
    }, {});
    return grouped;
  }, [operacoesAtivas]);

  const agendaHoje = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return compromissos.filter((item) => item.data_hora?.slice(0, 10) === todayIso && item.status !== "cancelado");
  }, [compromissos]);

  const agendaAmanha = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);
    return compromissos.filter((item) => item.data_hora?.slice(0, 10) === tomorrowIso && item.status !== "cancelado");
  }, [compromissos]);

  return {
    loading,
    clientes,
    clientesMap,
    operacoes,
    operacoesAtivas,
    recebiveis: recebiveisNormalizados,
    eventos,
    compromissos,
    agendaHoje,
    agendaAmanha,
    dashboardMetrics,
    produtosAtivos,
    pipeline,
    fetchAll,
    createCliente,
    updateCliente,
    createOperacao,
    updateOperacao,
    updateOperacaoStatus,
    addEvento,
    updateRecebivel,
    createCompromisso,
    updateCompromisso,
  };
}