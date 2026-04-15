import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { CrmCliente, CrmHistorico, CrmPipelineStatus } from "@/lib/crm-constants";
import { useToast } from "@/hooks/use-toast";

export function useCrmClientes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<CrmCliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("crm_clientes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar clientes CRM", description: error.message, variant: "destructive" });
    } else {
      setClientes((data as any[]) || []);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const createCliente = async (data: Partial<CrmCliente>) => {
    if (!user) return null;
    const payload = { ...data, user_id: user.id };
    const { data: created, error } = await supabase
      .from("crm_clientes")
      .insert(payload as any)
      .select()
      .single();

    if (error) {
      toast({ title: "Erro ao criar cliente", description: error.message, variant: "destructive" });
      return null;
    }
    await fetchClientes();
    toast({ title: "Cliente criado com sucesso" });
    return created;
  };

  const updateCliente = async (id: string, data: Partial<CrmCliente>) => {
    if (!user) return;
    const payload = { ...data, updated_by: user.id };
    const { error } = await supabase
      .from("crm_clientes")
      .update(payload as any)
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao atualizar cliente", description: error.message, variant: "destructive" });
      return;
    }
    await fetchClientes();
    toast({ title: "Cliente atualizado" });
  };

  const updateStatus = async (id: string, newStatus: CrmPipelineStatus, oldStatus: CrmPipelineStatus) => {
    if (!user) return;
    const { error } = await supabase
      .from("crm_clientes")
      .update({ status: newStatus, updated_by: user.id } as any)
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao mover cliente", description: error.message, variant: "destructive" });
      return;
    }

    // Add history entry
    await supabase.from("crm_historico").insert({
      cliente_id: id,
      user_id: user.id,
      tipo: "status",
      titulo: "Status alterado",
      status_anterior: oldStatus,
      status_novo: newStatus,
    } as any);

    await fetchClientes();
  };

  const deleteCliente = async (id: string) => {
    const { error } = await supabase.from("crm_clientes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir cliente", description: error.message, variant: "destructive" });
      return;
    }
    await fetchClientes();
    toast({ title: "Cliente excluído" });
  };

  return { clientes, loading, fetchClientes, createCliente, updateCliente, updateStatus, deleteCliente };
}

export function useCrmHistorico(clienteId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [historico, setHistorico] = useState<CrmHistorico[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistorico = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("crm_historico")
      .select("*")
      .eq("cliente_id", clienteId)
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
    const { error } = await supabase.from("crm_historico").insert({
      cliente_id: clienteId,
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
