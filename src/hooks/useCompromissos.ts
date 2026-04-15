import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Compromisso } from "@/lib/pj-constants";

export function useCompromissos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompromissos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_compromissos")
      .select("*")
      .order("data_hora", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar compromissos", description: error.message, variant: "destructive" });
    } else {
      setCompromissos((data as any[]) || []);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchCompromissos(); }, [fetchCompromissos]);

  const createCompromisso = async (data: Partial<Compromisso>) => {
    if (!user) return null;
    const { data: created, error } = await supabase
      .from("admin_compromissos")
      .insert({ ...data, user_id: user.id } as any)
      .select()
      .single();
    if (error) {
      toast({ title: "Erro ao criar compromisso", description: error.message, variant: "destructive" });
      return null;
    }
    await fetchCompromissos();
    toast({ title: "Compromisso criado" });
    return created;
  };

  const updateCompromisso = async (id: string, data: Partial<Compromisso>) => {
    const { error } = await supabase.from("admin_compromissos").update(data as any).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar compromisso", description: error.message, variant: "destructive" });
      return;
    }
    await fetchCompromissos();
  };

  const deleteCompromisso = async (id: string) => {
    const { error } = await supabase.from("admin_compromissos").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir compromisso", description: error.message, variant: "destructive" });
      return;
    }
    await fetchCompromissos();
    toast({ title: "Compromisso excluído" });
  };

  // Get today's and tomorrow's
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const compromissosHoje = compromissos.filter(c => c.data_hora?.slice(0, 10) === todayStr && c.status !== 'cancelado');
  const compromissosAmanha = compromissos.filter(c => c.data_hora?.slice(0, 10) === tomorrowStr && c.status !== 'cancelado');

  return { compromissos, loading, fetchCompromissos, createCompromisso, updateCompromisso, deleteCompromisso, compromissosHoje, compromissosAmanha };
}
