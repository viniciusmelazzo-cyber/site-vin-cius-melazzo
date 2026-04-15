import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { ClientePj, PjRecebimento, PjHistorico } from "@/lib/pj-constants";

export function usePjClientes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<ClientePj[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes_pj")
      .select("*")
      .order("nome", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar clientes PJ", description: error.message, variant: "destructive" });
    } else {
      setClientes((data as any[]) || []);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const createCliente = async (data: Partial<ClientePj>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from("clientes_pj")
      .insert({ ...data, user_id: user.id } as any)
      .select()
      .single();
    if (error) {
      toast({ title: "Erro ao criar cliente PJ", description: error.message, variant: "destructive" });
      return null;
    }
    await fetchClientes();
    toast({ title: "Cliente PJ criado com sucesso" });
    return created;
  };

  const updateCliente = async (id: string, data: Partial<ClientePj>) => {
    if (!user) return;
    const { error } = await supabase.from("clientes_pj").update(data as any).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar cliente PJ", description: error.message, variant: "destructive" });
      return;
    }
    await fetchClientes();
    toast({ title: "Cliente PJ atualizado" });
  };

  const deleteCliente = async (id: string) => {
    const { error } = await supabase.from("clientes_pj").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir cliente PJ", description: error.message, variant: "destructive" });
      return;
    }
    await fetchClientes();
    toast({ title: "Cliente PJ excluído" });
  };

  return { clientes, loading, fetchClientes, createCliente, updateCliente, deleteCliente };
}

export function usePjRecebimentos(clienteId: string | null) {
  const { toast } = useToast();
  const [recebimentos, setRecebimentos] = useState<PjRecebimento[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecebimentos = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("pj_recebimentos")
      .select("*")
      .eq("cliente_pj_id", clienteId)
      .order("data_vencimento", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar recebimentos", description: error.message, variant: "destructive" });
    } else {
      setRecebimentos((data as any[]) || []);
    }
    setLoading(false);
  }, [clienteId, toast]);

  useEffect(() => { fetchRecebimentos(); }, [fetchRecebimentos]);

  const addRecebimento = async (data: Partial<PjRecebimento>) => {
    if (!clienteId) return;
    const { error } = await supabase.from("pj_recebimentos").insert({ ...data, cliente_pj_id: clienteId } as any);
    if (error) {
      toast({ title: "Erro ao adicionar recebimento", description: error.message, variant: "destructive" });
      return;
    }
    await fetchRecebimentos();
    toast({ title: "Recebimento adicionado" });
  };

  const updateRecebimento = async (id: string, data: Partial<PjRecebimento>) => {
    const { error } = await supabase.from("pj_recebimentos").update(data as any).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar recebimento", description: error.message, variant: "destructive" });
      return;
    }
    await fetchRecebimentos();
  };

  const deleteRecebimento = async (id: string) => {
    const { error } = await supabase.from("pj_recebimentos").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir recebimento", description: error.message, variant: "destructive" });
      return;
    }
    await fetchRecebimentos();
  };

  return { recebimentos, loading, fetchRecebimentos, addRecebimento, updateRecebimento, deleteRecebimento };
}

export function usePjHistorico(clienteId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [historico, setHistorico] = useState<PjHistorico[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistorico = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("pj_historico")
      .select("*")
      .eq("cliente_pj_id", clienteId)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar histórico", description: error.message, variant: "destructive" });
    } else {
      setHistorico((data as any[]) || []);
    }
    setLoading(false);
  }, [clienteId, toast]);

  useEffect(() => { fetchHistorico(); }, [fetchHistorico]);

  const addHistorico = async (entry: { tipo: string; titulo: string; descricao?: string }) => {
    if (!user || !clienteId) return;
    const { error } = await supabase.from("pj_historico").insert({
      cliente_pj_id: clienteId,
      user_id: user.id,
      ...entry,
    } as any);
    if (error) {
      toast({ title: "Erro ao adicionar histórico", description: error.message, variant: "destructive" });
      return;
    }
    await fetchHistorico();
  };

  return { historico, loading, fetchHistorico, addHistorico };
}
