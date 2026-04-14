import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categorias = [
  "Salário", "Freelance", "Investimentos", "Aluguel", "Alimentação",
  "Transporte", "Saúde", "Educação", "Lazer", "Moradia", "Cartão de Crédito", "Outros",
];

interface Entry {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

const emptyForm = { type: "despesa", category: "Outros", description: "", amount: "", date: new Date().toISOString().slice(0, 10) };

const Lancamentos = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("financial_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    entries.forEach((e) => {
      const d = new Date(e.date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    return Array.from(months).sort().reverse();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const d = new Date(e.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
    });
  }, [entries, selectedMonth]);

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  const navigateMonth = (dir: number) => {
    const idx = availableMonths.indexOf(selectedMonth);
    const next = idx - dir;
    if (next >= 0 && next < availableMonths.length) setSelectedMonth(availableMonths[next]);
  };

  const handleSave = async () => {
    if (!user || !form.amount || !form.description) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        type: form.type,
        category: form.category,
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
      };

      if (editingId) {
        const { error } = await supabase.from("financial_entries").update(payload).eq("id", editingId).eq("user_id", user.id);
        if (error) throw error;
        toast({ title: "Lançamento atualizado!" });
      } else {
        const { error } = await supabase.from("financial_entries").insert(payload);
        if (error) throw error;
        toast({ title: "Lançamento criado!" });
      }
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchEntries();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: Entry) => {
    setForm({
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: String(entry.amount),
      date: entry.date,
    });
    setEditingId(entry.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("financial_entries").delete().eq("id", id).eq("user_id", user!.id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lançamento excluído" });
      fetchEntries();
    }
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ClientLayout role="client">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Lançamentos</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Gerencie suas receitas e despesas</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                <PlusCircle className="h-4 w-4" /> Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">{editingId ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Tipo</Label>
                    <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                      <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Categoria</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                      <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Descrição</Label>
                  <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="font-body" placeholder="Descrição do lançamento" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Valor (R$)</Label>
                    <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} className="font-body" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Data</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="font-body" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={loading} className="w-full font-body bg-gradient-gold text-primary hover:opacity-90">
                  {loading ? "Salvando..." : editingId ? "Salvar Alterações" : "Criar Lançamento"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-display font-bold capitalize min-w-[200px] text-center">{monthLabel}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} disabled={availableMonths.indexOf(selectedMonth) === 0}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Data</TableHead>
                  <TableHead className="font-body text-xs">Tipo</TableHead>
                  <TableHead className="font-body text-xs">Categoria</TableHead>
                  <TableHead className="font-body text-xs">Descrição</TableHead>
                  <TableHead className="font-body text-xs text-right">Valor</TableHead>
                  <TableHead className="font-body text-xs w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-body text-sm">{new Date(entry.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge variant={entry.type === "receita" ? "default" : "secondary"} className="font-body text-[10px] capitalize">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-body text-sm">{entry.category}</TableCell>
                    <TableCell className="font-body text-sm">{entry.description}</TableCell>
                    <TableCell className={`font-body text-sm text-right font-semibold ${entry.type === "receita" ? "text-green-700" : "text-destructive"}`}>
                      {entry.type === "receita" ? "+" : "−"}{fmt(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-body text-sm">
                      Nenhum lançamento neste mês. Clique em "Novo Lançamento" para começar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Lancamentos;
