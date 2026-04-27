import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  contasBancariasPJ as contasInit,
  cartoesPJ as cartoesInit,
  lancamentosPJ as lancsInit,
  sociosPJ,
  saldoTotalContasPJ,
  faturaTotalCartoesPJ,
  limiteTotalCartoesPJ,
  fmt, fmtK,
  type ContaBancariaPJ, type CartaoCreditoPJ, type LancamentoPJ,
} from "@/data/mockAgro";
import {
  Wallet, CreditCard, Receipt, Users, Plus, Download, TrendingUp, TrendingDown,
  Search, ArrowUpRight, ArrowDownRight, Banknote, Building2, Eye, EyeOff,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

type DialogKind = null | "conta" | "cartao" | "lancamento";

export default function CentralFinanceira() {
  const [contas, setContas] = useState<ContaBancariaPJ[]>(contasInit);
  const [cartoes, setCartoes] = useState<CartaoCreditoPJ[]>(cartoesInit);
  const [lancs, setLancs] = useState<LancamentoPJ[]>(lancsInit);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [hideValores, setHideValores] = useState(false);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<"todos" | "receita" | "despesa">("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | "pago" | "pendente">("todos");

  // KPIs do mês corrente (Abr/25 baseado nos mocks)
  const monthLancs = useMemo(
    () => lancs.filter((l) => l.data.startsWith("2025-04")),
    [lancs]
  );
  const receitaMes = monthLancs.filter((l) => l.tipo === "receita" && l.status === "pago").reduce((s, l) => s + l.valor, 0);
  const despesaMes = monthLancs.filter((l) => l.tipo === "despesa" && l.status === "pago").reduce((s, l) => s + l.valor, 0);
  const resultadoMes = receitaMes - despesaMes;
  const saldoTotal = useMemo(() => contas.filter(c => c.ativa).reduce((s, c) => s + c.saldo, 0), [contas]);
  const fatura = useMemo(() => cartoes.filter(c => c.ativo).reduce((s, c) => s + c.faturaAtual, 0), [cartoes]);
  const limite = useMemo(() => cartoes.filter(c => c.ativo).reduce((s, c) => s + c.limite, 0), [cartoes]);

  // Evolução 6 meses
  const evolucao = useMemo(() => {
    const meses = [
      { key: "2024-11", label: "Nov" }, { key: "2024-12", label: "Dez" },
      { key: "2025-01", label: "Jan" }, { key: "2025-02", label: "Fev" },
      { key: "2025-03", label: "Mar" }, { key: "2025-04", label: "Abr" },
    ];
    return meses.map(({ key, label }) => {
      const r = lancs.filter(l => l.data.startsWith(key) && l.tipo === "receita" && l.status === "pago").reduce((s, l) => s + l.valor, 0);
      const d = lancs.filter(l => l.data.startsWith(key) && l.tipo === "despesa" && l.status === "pago").reduce((s, l) => s + l.valor, 0);
      return { mes: label, receita: r, despesa: d };
    });
  }, [lancs]);

  // Filtros lançamentos
  const filtered = useMemo(() => {
    return lancs.filter((l) => {
      if (tipoFilter !== "todos" && l.tipo !== tipoFilter) return false;
      if (statusFilter !== "todos" && l.status !== statusFilter) return false;
      if (search && !`${l.descricao} ${l.categoria} ${l.conta}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [lancs, search, tipoFilter, statusFilter]);

  const toggleStatus = (id: string) => {
    setLancs((prev) => prev.map((l) => l.id === id ? { ...l, status: l.status === "pago" ? "pendente" : "pago" } : l));
    toast.success("Status atualizado");
  };

  const exportCSV = () => {
    const rows = [
      ["Data", "Tipo", "Descrição", "Categoria", "Conta", "Status", "Valor"].join(";"),
      ...filtered.map(l => [l.data, l.tipo, `"${l.descricao}"`, l.categoria, l.conta, l.status, String(l.valor).replace(".", ",")].join(";")),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `central-financeira-lancamentos.csv`;
    a.click();
    toast.success("CSV exportado!");
  };

  const maskValor = (v: string | number) => hideValores ? "•••••" : v;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Operação Agro · PJ"
          title="Central Financeira"
          description="Fazenda São João Agropecuária Ltda · CNPJ 23.456.789/0001-12 · controle completo de contas, cartões, lançamentos e sócios"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setHideValores(v => !v)}>
            {hideValores ? <Eye className="h-4 w-4 mr-1.5" /> : <EyeOff className="h-4 w-4 mr-1.5" />}
            {hideValores ? "Mostrar" : "Ocultar"} valores
          </Button>
          <Button size="sm" className="bg-gold hover:bg-gold-dark text-navy" onClick={() => setDialog("lancamento")}>
            <Plus className="h-4 w-4 mr-1.5" /> Novo Lançamento
          </Button>
        </div>
      </div>

      {/* KPIs do mês */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Saldo total contas" value={hideValores ? "•••••" : fmtK(saldoTotal)} icon={<Banknote className="h-4 w-4" />} highlight />
        <KpiCard label="Receita Abr/25" value={hideValores ? "•••••" : fmtK(receitaMes)} icon={<ArrowUpRight className="h-4 w-4" />} />
        <KpiCard label="Despesa Abr/25" value={hideValores ? "•••••" : fmtK(despesaMes)} icon={<ArrowDownRight className="h-4 w-4" />} inverse />
        <KpiCard label="Resultado do mês" value={hideValores ? "•••••" : fmtK(resultadoMes)} icon={resultadoMes >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} highlight />
        <KpiCard label="Fatura cartões" value={hideValores ? "•••••" : fmtK(fatura)} icon={<CreditCard className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="mensal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="mensal"><Receipt className="h-3.5 w-3.5 mr-1.5" />Visão Mensal</TabsTrigger>
          <TabsTrigger value="contas"><Wallet className="h-3.5 w-3.5 mr-1.5" />Contas & Cartões</TabsTrigger>
          <TabsTrigger value="lancamentos"><Banknote className="h-3.5 w-3.5 mr-1.5" />Lançamentos</TabsTrigger>
          <TabsTrigger value="socios"><Users className="h-3.5 w-3.5 mr-1.5" />Sócios</TabsTrigger>
        </TabsList>

        {/* TAB VISÃO MENSAL */}
        <TabsContent value="mensal" className="space-y-6 mt-6">
          <SectionCard title="Evolução 6 meses" subtitle="Receita vs Despesa (apenas pagos)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="receita" fill="hsl(var(--positive))" radius={[3, 3, 0, 0]} name="Receita" />
                <Bar dataKey="despesa" fill="hsl(var(--gold))" radius={[3, 3, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Top categorias de receita — Abril/25">
              <div className="space-y-2">
                {Object.entries(
                  monthLancs.filter(l => l.tipo === "receita" && l.status === "pago")
                    .reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.categoria]: (acc[l.categoria] || 0) + l.valor }), {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, val]) => {
                    const pct = (val / receitaMes) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground">{cat}</span>
                          <span className="tabular font-semibold text-navy">{hideValores ? "•••••" : fmtK(val)}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded overflow-hidden">
                          <div className="h-full bg-positive" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </SectionCard>
            <SectionCard title="Top categorias de despesa — Abril/25">
              <div className="space-y-2">
                {Object.entries(
                  monthLancs.filter(l => l.tipo === "despesa" && l.status === "pago")
                    .reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.categoria]: (acc[l.categoria] || 0) + l.valor }), {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([cat, val]) => {
                    const pct = (val / despesaMes) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground">{cat}</span>
                          <span className="tabular font-semibold text-navy">{hideValores ? "•••••" : fmtK(val)}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* TAB CONTAS & CARTÕES */}
        <TabsContent value="contas" className="space-y-6 mt-6">
          <SectionCard
            title="Contas Bancárias PJ"
            subtitle={`${contas.filter(c => c.ativa).length} contas ativas · Saldo total ${hideValores ? "•••••" : fmtK(saldoTotal)}`}
            icon={<Wallet className="h-4 w-4" />}
            actions={
              <Button size="sm" variant="outline" onClick={() => setDialog("conta")}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Nova Conta
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Banco</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Apelido</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ag/Conta</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tipo</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Saldo</th>
                    <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((c) => (
                    <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/30">
                      <td className="py-2.5 px-3 font-medium text-navy">{c.banco}</td>
                      <td className="py-2.5 px-3 text-foreground">{c.apelido}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground tabular">{c.agencia} / {c.conta}</td>
                      <td className="py-2.5 px-3 text-xs text-foreground capitalize">{c.tipo}</td>
                      <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{hideValores ? "•••••" : fmt(c.saldo)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge className={cn("text-[10px]", c.ativa ? "bg-positive/10 text-positive hover:bg-positive/10" : "bg-secondary text-muted-foreground")}>
                          {c.ativa ? "ativa" : "encerrada"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Cartões de Crédito PJ"
            subtitle={`${cartoes.filter(c => c.ativo).length} cartões · Limite ${hideValores ? "•••••" : fmtK(limite)} · Fatura ${hideValores ? "•••••" : fmtK(fatura)}`}
            icon={<CreditCard className="h-4 w-4" />}
            actions={
              <Button size="sm" variant="outline" onClick={() => setDialog("cartao")}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Novo Cartão
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartoes.map((c) => {
                const pct = (c.faturaAtual / c.limite) * 100;
                return (
                  <div key={c.id} className="navy-card p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gold/80">{c.bandeira}</p>
                        <p className="font-display text-base text-linen mt-0.5">{c.apelido}</p>
                        <p className="text-xs text-linen/60 mt-0.5">{c.banco}</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-gold" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-linen/60">Fatura atual</span>
                        <span className="text-linen tabular font-semibold">{hideValores ? "•••••" : fmt(c.faturaAtual)}</span>
                      </div>
                      <div className="h-1.5 bg-linen/10 rounded overflow-hidden">
                        <div className={cn("h-full", pct > 80 ? "bg-amber-500" : "bg-gold")} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-linen/50">
                        <span>{pct.toFixed(0)}% utilizado</span>
                        <span>Limite {hideValores ? "•••••" : fmtK(c.limite)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-linen/70 pt-2 border-t border-linen/10">
                      <span>Fecha dia {c.diaFechamento}</span>
                      <span>Vence dia {c.diaVencimento}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        {/* TAB LANÇAMENTOS */}
        <TabsContent value="lancamentos" className="space-y-4 mt-6">
          <SectionCard
            title={`Lançamentos · ${filtered.length} resultados`}
            subtitle="Receitas e despesas da operação PJ"
            actions={
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={exportCSV}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Exportar CSV
                </Button>
                <Button size="sm" className="bg-gold hover:bg-gold-dark text-navy" onClick={() => setDialog("lancamento")}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Novo
                </Button>
              </div>
            }
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar descrição, categoria, conta…" className="pl-8 h-9 text-sm" />
              </div>
              <Select value={tipoFilter} onValueChange={(v: any) => setTipoFilter(v)}>
                <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="receita">Apenas receita</SelectItem>
                  <SelectItem value="despesa">Apenas despesa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pago">Pagos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Data</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Descrição</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Categoria</th>
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Conta</th>
                    <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className="border-b border-border/40 hover:bg-secondary/30">
                      <td className="py-2 px-3 text-xs tabular text-muted-foreground whitespace-nowrap">{l.data.split("-").reverse().join("/")}</td>
                      <td className="py-2 px-3 text-foreground">{l.descricao}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{l.categoria}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{l.conta}</td>
                      <td className="py-2 px-3 text-center">
                        <button onClick={() => toggleStatus(l.id)}>
                          <Badge className={cn("text-[10px] cursor-pointer", l.status === "pago" ? "bg-positive/10 text-positive hover:bg-positive/20" : "bg-amber-100 text-amber-800 hover:bg-amber-200")}>
                            {l.status}
                          </Badge>
                        </button>
                      </td>
                      <td className={cn("py-2 px-3 text-right tabular font-semibold", l.tipo === "receita" ? "text-positive" : "text-navy")}>
                        {l.tipo === "receita" ? "+" : "−"}{hideValores ? "•••••" : fmt(l.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* TAB SÓCIOS */}
        <TabsContent value="socios" className="space-y-4 mt-6">
          <SectionCard title="Quadro Societário" subtitle="Fazenda São João Agropecuária Ltda · CNPJ 23.456.789/0001-12" icon={<Users className="h-4 w-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sociosPJ.map((s) => (
                <div key={s.id} className="border border-border rounded p-5 space-y-3 hover:border-gold/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-lg text-navy">{s.nome}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.cargo}</p>
                    </div>
                    <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/10">{s.participacao}%</Badge>
                  </div>
                  <div className="h-1.5 bg-secondary rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gold to-gold-dark" style={{ width: `${s.participacao}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
                    <span>Sócio desde {s.desde}</span>
                    {s.coobrigado && <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-700">Coobrigado</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Composição patrimonial" subtitle="Aportes e ganho/perda por sócio (proporcional)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sociosPJ.map((s) => {
                const aporte = (4_200_000 * s.participacao) / 100;
                const ganho = (resultadoMes * s.participacao) / 100;
                return (
                  <div key={s.id} className="bg-secondary/30 rounded p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.nome}</p>
                    <p className="font-display text-2xl font-bold text-navy">{hideValores ? "•••••" : fmtK(aporte)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">capital integralizado</p>
                    <div className={cn("text-xs mt-2 font-semibold", ganho >= 0 ? "text-positive" : "text-destructive")}>
                      {ganho >= 0 ? "+" : ""}{hideValores ? "•••••" : fmt(ganho)} no mês
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* DIÁLOGOS DEMO */}
      <NovaContaDialog open={dialog === "conta"} onOpenChange={(o) => setDialog(o ? "conta" : null)} onSave={(c) => { setContas(prev => [...prev, c]); toast.success("Conta criada (modo demo)"); }} />
      <NovoCartaoDialog open={dialog === "cartao"} onOpenChange={(o) => setDialog(o ? "cartao" : null)} onSave={(c) => { setCartoes(prev => [...prev, c]); toast.success("Cartão criado (modo demo)"); }} />
      <NovoLancamentoDialog open={dialog === "lancamento"} onOpenChange={(o) => setDialog(o ? "lancamento" : null)} contas={contas} onSave={(l) => { setLancs(prev => [l, ...prev]); toast.success("Lançamento registrado (modo demo)"); }} />
    </div>
  );
}

/* ─────────── DIÁLOGOS DEMO ─────────── */

function NovaContaDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (c: ContaBancariaPJ) => void }) {
  const [banco, setBanco] = useState("");
  const [apelido, setApelido] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [tipo, setTipo] = useState<"corrente" | "poupanca" | "investimento">("corrente");
  const [saldo, setSaldo] = useState("");

  const submit = () => {
    if (!banco || !apelido) { toast.error("Preencha banco e apelido"); return; }
    onSave({
      id: `CB-${Date.now()}`,
      banco, apelido, agencia: agencia || "—", conta: conta || "—",
      tipo, saldo: Number(saldo) || 0,
      atualizadoEm: new Date().toISOString().split("T")[0],
      ativa: true,
    });
    onOpenChange(false);
    setBanco(""); setApelido(""); setAgencia(""); setConta(""); setSaldo("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-gold" /> Nova Conta Bancária PJ</SheetTitle>
          <SheetDescription>Cadastre uma conta da empresa para controle de saldo e lançamentos.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Banco *</Label><Input value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ex: Banco do Brasil" /></div>
          <div><Label>Apelido *</Label><Input value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder="Ex: BB Operação" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Agência</Label><Input value={agencia} onChange={(e) => setAgencia(e.target.value)} /></div>
            <div><Label>Conta</Label><Input value={conta} onChange={(e) => setConta(e.target.value)} /></div>
          </div>
          <div><Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Corrente</SelectItem>
                <SelectItem value="poupanca">Poupança</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Saldo inicial (R$)</Label><Input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="0" /></div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Criar conta</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NovoCartaoDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (c: CartaoCreditoPJ) => void }) {
  const [banco, setBanco] = useState("");
  const [apelido, setApelido] = useState("");
  const [bandeira, setBandeira] = useState<"Visa" | "Mastercard" | "Elo">("Visa");
  const [limite, setLimite] = useState("");
  const [fechamento, setFechamento] = useState("25");
  const [vencimento, setVencimento] = useState("5");

  const submit = () => {
    if (!banco || !apelido) { toast.error("Preencha banco e apelido"); return; }
    onSave({
      id: `CC-${Date.now()}`,
      banco, apelido, bandeira,
      limite: Number(limite) || 0,
      faturaAtual: 0,
      diaFechamento: Number(fechamento) || 25,
      diaVencimento: Number(vencimento) || 5,
      ativo: true,
    });
    onOpenChange(false);
    setBanco(""); setApelido(""); setLimite("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Novo Cartão de Crédito PJ</SheetTitle>
          <SheetDescription>Adicione um cartão corporativo para acompanhamento de fatura e limite.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Banco *</Label><Input value={banco} onChange={(e) => setBanco(e.target.value)} /></div>
          <div><Label>Apelido *</Label><Input value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder="Ex: BB Empresarial Ouro" /></div>
          <div><Label>Bandeira</Label>
            <Select value={bandeira} onValueChange={(v: any) => setBandeira(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="Elo">Elo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Limite (R$)</Label><Input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Dia fechamento</Label><Input type="number" min={1} max={31} value={fechamento} onChange={(e) => setFechamento(e.target.value)} /></div>
            <div><Label>Dia vencimento</Label><Input type="number" min={1} max={31} value={vencimento} onChange={(e) => setVencimento(e.target.value)} /></div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Criar cartão</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NovoLancamentoDialog({ open, onOpenChange, contas, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; contas: ContaBancariaPJ[]; onSave: (l: LancamentoPJ) => void }) {
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contaId, setContaId] = useState(contas[0]?.apelido || "");
  const [valor, setValor] = useState("");
  const [recorrencia, setRecorrencia] = useState<"unica" | "mensal" | "anual">("unica");

  const submit = () => {
    if (!descricao || !valor) { toast.error("Descrição e valor são obrigatórios"); return; }
    onSave({
      id: `L-${Date.now()}`,
      data, tipo, descricao,
      categoria: categoria || "Diversos",
      conta: contaId,
      valor: Number(valor) || 0,
      status: "pendente",
      recorrencia,
    });
    onOpenChange(false);
    setDescricao(""); setCategoria(""); setValor("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-gold" /> Novo Lançamento</SheetTitle>
          <SheetDescription>Registre uma receita ou despesa da operação PJ.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Data</Label><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
          </div>
          <div><Label>Descrição *</Label><Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Compra de fertilizante" /></div>
          <div><Label>Categoria</Label><Input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Insumos Lavoura" /></div>
          <div><Label>Conta</Label>
            <Select value={contaId} onValueChange={setContaId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {contas.filter(c => c.ativa).map(c => <SelectItem key={c.id} value={c.apelido}>{c.apelido}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Valor (R$) *</Label><Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} /></div>
          <div><Label>Recorrência</Label>
            <Select value={recorrencia} onValueChange={(v: any) => setRecorrencia(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unica">Única</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Registrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
