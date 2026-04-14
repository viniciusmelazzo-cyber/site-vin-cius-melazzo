import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusCircle, Pencil, Trash2, ChevronLeft, ChevronRight, Lightbulb, Target, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EXPENSE_CATEGORIES = [
  "Alimentação", "Transporte", "Saúde", "Educação", "Lazer",
  "Moradia", "Cartão de Crédito", "Investimentos", "Outros",
];

const BUDGET_TYPES = [
  { value: "fixa", label: "Despesa Fixa" },
  { value: "variavel", label: "Despesa Variável" },
  { value: "investimento", label: "Investimento/Poupança" },
];

// OBZ ideal distribution (50/30/20 rule adapted)
const IDEAL_DISTRIBUTION = {
  fixa: { max: 50, label: "Despesas Fixas", ideal: "≤ 50%" },
  variavel: { max: 30, label: "Despesas Variáveis", ideal: "≤ 30%" },
  investimento: { min: 20, label: "Investimentos", ideal: "≥ 20%" },
};

interface Budget {
  id: string;
  category: string;
  planned_amount: number;
  type: string;
  month: string;
}

interface Spent {
  category: string;
  total: number;
}

const emptyForm = { category: "Alimentação", planned_amount: "", type: "fixa" };

const Orcamento = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spent, setSpent] = useState<Spent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchData = async () => {
    if (!user) return;
    const [startDate, endDate] = getMonthRange(selectedMonth);

    const [budgetRes, entryRes] = await Promise.all([
      supabase.from("budgets").select("*").eq("user_id", user.id).eq("month", selectedMonth),
      supabase.from("financial_entries").select("category, amount").eq("user_id", user.id).eq("type", "despesa").gte("date", startDate).lte("date", endDate),
    ]);

    setBudgets((budgetRes.data as Budget[]) || []);

    // Aggregate spent by category
    const map: Record<string, number> = {};
    (entryRes.data || []).forEach((e: any) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    setSpent(Object.entries(map).map(([category, total]) => ({ category, total })));
  };

  useEffect(() => { fetchData(); }, [user, selectedMonth]);

  const getMonthRange = (m: string) => {
    const [y, mo] = m.split("-").map(Number);
    const start = `${y}-${String(mo).padStart(2, "0")}-01`;
    const end = new Date(y, mo, 0).toISOString().slice(0, 10);
    return [start, end];
  };

  const handleMonthChange = (dir: number) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    return new Date(y, m - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const amount = parseFloat(String(form.planned_amount).replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (editingId) {
      await supabase.from("budgets").update({
        category: form.category,
        planned_amount: amount,
        type: form.type,
      }).eq("id", editingId);
    } else {
      await supabase.from("budgets").insert({
        user_id: user.id,
        month: selectedMonth,
        category: form.category,
        planned_amount: amount,
        type: form.type,
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(false);
    setLoading(false);
    fetchData();
    toast({ title: editingId ? "Orçamento atualizado" : "Orçamento criado" });
  };

  const handleEdit = (b: Budget) => {
    setForm({ category: b.category, planned_amount: String(b.planned_amount), type: b.type });
    setEditingId(b.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
    fetchData();
    toast({ title: "Orçamento removido" });
  };

  const handleCopyPrevious = async () => {
    if (!user) return;
    const [y, m] = selectedMonth.split("-").map(Number);
    const prev = new Date(y, m - 2, 1);
    const prevMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
    const { data } = await supabase.from("budgets").select("*").eq("user_id", user.id).eq("month", prevMonth);
    if (!data || data.length === 0) {
      toast({ title: "Nenhum orçamento no mês anterior", variant: "destructive" });
      return;
    }
    const inserts = data.map((b: any) => ({
      user_id: user.id,
      month: selectedMonth,
      category: b.category,
      planned_amount: b.planned_amount,
      type: b.type,
    }));
    await supabase.from("budgets").insert(inserts);
    fetchData();
    toast({ title: `${inserts.length} itens copiados do mês anterior` });
  };

  // Aggregated data
  const totalPlanned = budgets.reduce((s, b) => s + Number(b.planned_amount), 0);
  const totalSpent = spent.reduce((s, e) => s + e.total, 0);

  const byType = useMemo(() => {
    const map: Record<string, number> = { fixa: 0, variavel: 0, investimento: 0 };
    budgets.forEach((b) => { map[b.type] = (map[b.type] || 0) + Number(b.planned_amount); });
    return map;
  }, [budgets]);

  const getSpentForCategory = (cat: string) => spent.find((s) => s.category === cat)?.total || 0;

  const getProgressColor = (pct: number) => {
    if (pct <= 75) return "bg-finance-positive";
    if (pct <= 100) return "bg-finance-warning";
    return "bg-finance-negative";
  };

  // Smart suggestions
  const suggestions = useMemo(() => {
    const tips: string[] = [];
    if (totalPlanned === 0) return ["Comece adicionando seus orçamentos para cada categoria de despesa."];

    const fixaPct = (byType.fixa / totalPlanned) * 100;
    const varPct = (byType.variavel / totalPlanned) * 100;
    const invPct = (byType.investimento / totalPlanned) * 100;

    if (fixaPct > 50) tips.push(`Despesas fixas representam ${fixaPct.toFixed(0)}% do orçamento (ideal ≤ 50%). Considere renegociar contratos ou reduzir assinaturas.`);
    if (varPct > 30) tips.push(`Despesas variáveis em ${varPct.toFixed(0)}% (ideal ≤ 30%). Analise gastos com lazer e alimentação fora.`);
    if (invPct < 20) tips.push(`Investimentos em apenas ${invPct.toFixed(0)}% (ideal ≥ 20%). Priorize reserva de emergência e aportes.`);

    budgets.forEach((b) => {
      const spentVal = getSpentForCategory(b.category);
      const pct = (spentVal / Number(b.planned_amount)) * 100;
      if (pct > 100) tips.push(`"${b.category}" estourou o orçamento em ${(pct - 100).toFixed(0)}%. Revise este gasto.`);
    });

    if (tips.length === 0) tips.push("Parabéns! Seu orçamento está equilibrado segundo a regra 50/30/20.");
    return tips;
  }, [budgets, spent, totalPlanned, byType]);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Orçamento Base Zero</h1>
            <p className="text-sm text-muted-foreground font-body">Planeje cada real antes de gastar — método 50/30/20</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-body font-medium capitalize w-40 text-center">{monthLabel}</span>
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Distribution Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(IDEAL_DISTRIBUTION) as [string, typeof IDEAL_DISTRIBUTION.fixa][]).map(([key, info]) => {
            const planned = byType[key] || 0;
            const pct = totalPlanned > 0 ? (planned / totalPlanned) * 100 : 0;
            const isOver = key === "investimento" ? pct < (info as any).min : pct > (info as any).max;
            return (
              <Card key={key} className={`border ${isOver ? "border-finance-warning/50" : "border-border"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">{info.label}</span>
                    <Badge variant={isOver ? "destructive" : "secondary"} className="text-[10px]">
                      {info.ideal}
                    </Badge>
                  </div>
                  <p className="text-lg font-display font-bold text-foreground">{fmt(planned)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOver ? "bg-finance-warning" : "bg-finance-positive"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-body text-muted-foreground">{pct.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary bar */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground font-body">Total Planejado</p>
                <p className="text-lg font-display font-bold text-foreground">{fmt(totalPlanned)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">Total Gasto</p>
                <p className={`text-lg font-display font-bold ${totalSpent > totalPlanned ? "text-finance-negative" : "text-finance-positive"}`}>
                  {fmt(totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">Saldo</p>
                <p className={`text-lg font-display font-bold ${totalPlanned - totalSpent >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
                  {fmt(totalPlanned - totalSpent)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {budgets.length === 0 && (
                <Button variant="outline" size="sm" onClick={handleCopyPrevious} className="font-body">
                  Copiar mês anterior
                </Button>
              )}
              <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="font-body gap-2">
                    <PlusCircle className="h-4 w-4" /> Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display">{editingId ? "Editar" : "Novo"} Orçamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-body">Categoria</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-body">Tipo</Label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {BUDGET_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-body">Valor Planejado (R$)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={form.planned_amount}
                        onChange={(e) => setForm({ ...form, planned_amount: e.target.value })}
                        placeholder="0,00"
                      />
                    </div>
                    <Button onClick={handleSave} disabled={loading} className="w-full font-body">
                      {loading ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Budget Items with Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spentVal = getSpentForCategory(b.category);
            const pct = Number(b.planned_amount) > 0 ? (spentVal / Number(b.planned_amount)) * 100 : 0;
            const remaining = Number(b.planned_amount) - spentVal;
            return (
              <Card key={b.id} className="border border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      <span className="font-body font-semibold text-foreground">{b.category}</span>
                      <Badge variant="outline" className="text-[10px] font-body">
                        {BUDGET_TYPES.find((t) => t.value === b.type)?.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(b)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-finance-negative" onClick={() => handleDelete(b.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-body text-muted-foreground">
                    <span>Gasto: {fmt(spentVal)}</span>
                    <span>Planejado: {fmt(Number(b.planned_amount))}</span>
                  </div>

                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-body font-medium ${remaining >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
                      {remaining >= 0 ? `Sobra: ${fmt(remaining)}` : `Estourou: ${fmt(Math.abs(remaining))}`}
                    </span>
                    <span className="text-xs font-body text-muted-foreground">{pct.toFixed(0)}%</span>
                  </div>

                  {pct > 90 && pct <= 100 && (
                    <div className="flex items-center gap-1.5 text-finance-warning">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-body">Atenção: próximo do limite</span>
                    </div>
                  )}
                  {pct > 100 && (
                    <div className="flex items-center gap-1.5 text-finance-negative">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-body">Orçamento estourado!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {budgets.length === 0 && (
            <Card className="col-span-full border border-dashed border-border">
              <CardContent className="p-8 text-center">
                <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-body text-muted-foreground">
                  Nenhum orçamento definido para este mês.
                </p>
                <p className="text-xs font-body text-muted-foreground mt-1">
                  Clique em "Adicionar" ou "Copiar mês anterior" para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Smart Suggestions */}
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              Sugestões Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((tip, i) => (
              <p key={i} className="text-xs font-body text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                {tip}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Orcamento;
