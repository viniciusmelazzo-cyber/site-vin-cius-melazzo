import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { fazendas, totalAreaFazendas, totalValorFazendas, fmtK, fmtHa, areasArrendadas, totalAreaArrendada, custoArrendamentoAnual } from "@/data/mockAgro";
import { MapPin, Layers, Beef, Sprout, TreePine, Building2, FileText, Handshake } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/hooks/use-drill-down";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

const SITUACAO_COLORS: Record<string, string> = {
  Quitada: "bg-positive/10 text-positive border-positive/30",
  "Hipotecada — BB": "bg-amber-100 text-amber-800 border-amber-300",
};

const ARREND_TONE: Record<string, string> = {
  Ativo: "bg-positive/10 text-positive border-positive/30",
  Renovar: "bg-amber-100 text-amber-800 border-amber-300",
  Encerrar: "bg-negative/10 text-negative border-negative/30",
};

export default function Fazendas() {
  const { openDrill } = useDrillDown();

  const totalRebanho = fazendas.reduce((s, f) => s + f.rebanho, 0);
  const totalLavoura = fazendas.reduce((s, f) => s + f.areaLavoura, 0);

  const dataValor = fazendas.map((f) => ({ nome: f.nome.replace("Fazenda ", ""), valor: f.valorPatrimonial }));
  const dataArea = fazendas.map((f) => ({
    nome: f.nome.replace("Fazenda ", ""),
    Pastagem: f.areaPastagem,
    Lavoura: f.areaLavoura,
    Preservação: f.areaPreservacao,
  }));

  const verBenfeitorias = (faz: typeof fazendas[number]) =>
    openDrill({
      title: `Benfeitorias · ${faz.nome}`,
      subtitle: `${faz.cidade} · Matrícula ${faz.matricula}`,
      kpis: [
        { label: "Área total", value: fmtHa(faz.area) },
        { label: "Valor patrimonial", value: fmtK(faz.valorPatrimonial) },
        { label: "Rebanho", value: `${faz.rebanho} cab` },
      ],
      columns: [
        { key: "item", label: "Benfeitoria" },
      ],
      rows: faz.benfeitorias.map((b) => ({ item: b })),
    });

  const verTodasFazendas = () =>
    openDrill({
      title: "Mapa do Grupo — 3 Fazendas",
      subtitle: `${totalAreaFazendas.toLocaleString("pt-BR")} ha · ${totalRebanho.toLocaleString("pt-BR")} cabeças · ${fmtK(totalValorFazendas)}`,
      kpis: [
        { label: "Propriedades", value: String(fazendas.length) },
        { label: "Área total", value: fmtHa(totalAreaFazendas) },
        { label: "Rebanho", value: `${totalRebanho} cab` },
        { label: "Valor", value: fmtK(totalValorFazendas) },
      ],
      columns: [
        { key: "nome", label: "Fazenda" },
        { key: "cidade", label: "Localização" },
        { key: "area", label: "Área", align: "right", format: (v: number) => fmtHa(v) },
        { key: "rebanho", label: "Rebanho", align: "right", format: (v: number) => `${v} cab` },
        { key: "valorPatrimonial", label: "Valor", align: "right", format: (v: number) => fmtK(v) },
        { key: "situacao", label: "Situação" },
      ],
      rows: fazendas,
    });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Patrimônio Rural"
        title="Mapa de Fazendas"
        description={`${fazendas.length} propriedades · ${totalAreaFazendas.toLocaleString("pt-BR")} ha sob gestão · ${fmtK(totalValorFazendas)} em ativos imobilizados`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Propriedades"
          value={String(fazendas.length)}
          icon={<Building2 className="h-4 w-4" />}
          highlight
          onClick={verTodasFazendas}
        />
        <KpiCard
          label="Área Total"
          value={fmtHa(totalAreaFazendas)}
          icon={<Layers className="h-4 w-4" />}
          onClick={verTodasFazendas}
        />
        <KpiCard
          label="Rebanho Consolidado"
          value={`${totalRebanho.toLocaleString("pt-BR")} cab`}
          icon={<Beef className="h-4 w-4" />}
          onClick={verTodasFazendas}
        />
        <KpiCard
          label="Valor Patrimonial"
          value={fmtK(totalValorFazendas)}
          icon={<Sprout className="h-4 w-4" />}
          onClick={verTodasFazendas}
        />
      </div>

      {/* Cards das Fazendas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {fazendas.map((f) => (
          <article key={f.id} className="melazzo-card p-5 flex flex-col">
            <header className="flex items-start justify-between mb-4 gap-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-semibold">{f.id}</p>
                <h3 className="font-display text-lg font-semibold text-navy mt-1 leading-tight">{f.nome}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {f.cidade}
                </p>
              </div>
              <Badge
                className={cn(
                  "text-[10px] shrink-0 border",
                  SITUACAO_COLORS[f.situacao] || "bg-secondary text-foreground"
                )}
              >
                {f.situacao}
              </Badge>
            </header>

            {/* KPIs principais */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/40 p-3 rounded">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Área</p>
                <p className="font-display text-xl font-semibold text-navy tabular">{f.area}<span className="text-xs text-muted-foreground ml-1">ha</span></p>
              </div>
              <div className="bg-secondary/40 p-3 rounded">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Valor</p>
                <p className="font-display text-xl font-semibold text-gold-dark tabular">{fmtK(f.valorPatrimonial)}</p>
              </div>
            </div>

            {/* Composição de uso */}
            <div className="space-y-2 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Uso do Solo</p>
              {[
                { label: "Pastagem", valor: f.areaPastagem, icon: Beef, color: "from-agro to-agro-light" },
                { label: "Lavoura", valor: f.areaLavoura, icon: Sprout, color: "from-gold to-gold-dark" },
                { label: "Preservação", valor: f.areaPreservacao, icon: TreePine, color: "from-emerald-500 to-emerald-600" },
              ].map(({ label, valor, icon: Icon, color }) => {
                const pct = (valor / f.area) * 100;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1 text-foreground">
                        <Icon className="h-3 w-3" /> {label}
                      </span>
                      <span className="tabular text-muted-foreground">{valor} ha · {pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded overflow-hidden">
                      <div className={cn("h-full bg-gradient-to-r", color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-border/40">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rebanho</p>
                <p className="text-sm font-semibold text-foreground tabular">{f.rebanho}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Soja sc/ha</p>
                <p className="text-sm font-semibold text-foreground tabular">{f.produtividadeSoja}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cultura</p>
                <p className="text-[10px] font-medium text-foreground leading-tight">{f.cultura}</p>
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Matrícula</p>
              <p className="text-xs tabular text-foreground mb-3">{f.matricula} · CAR {f.car}</p>
              <button
                onClick={() => verBenfeitorias(f)}
                className="w-full text-xs font-semibold text-gold-dark hover:text-gold flex items-center justify-center gap-1.5 py-2 border border-gold/30 rounded hover:bg-gold/5 transition-colors"
              >
                <FileText className="h-3 w-3" /> Ver benfeitorias ({f.benfeitorias.length})
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Comparativo de área e valor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Composição de Uso por Fazenda" subtitle="Distribuição de hectares (pastagem · lavoura · preservação)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataArea}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="nome" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v} ha`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} ha`} />
              <Bar dataKey="Pastagem" stackId="a" fill="hsl(var(--agro))" />
              <Bar dataKey="Lavoura" stackId="a" fill="hsl(var(--gold))" />
              <Bar dataKey="Preservação" stackId="a" fill="hsl(160 60% 40%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Distribuição de Valor Patrimonial" subtitle="Concentração por propriedade">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dataValor}
                dataKey="valor"
                nameKey="nome"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(p: { name?: string; percent?: number }) => `${p.name ?? ""} · ${((p.percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {dataValor.map((_, i) => (
                  <Cell key={i} fill={["hsl(var(--navy))", "hsl(var(--gold))", "hsl(var(--agro))"][i]} />
                ))}
              </Pie>
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtK(v)} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Áreas Arrendadas */}
      <SectionCard
        title="Áreas Arrendadas"
        subtitle={`${areasArrendadas.length} contratos · ${totalAreaArrendada.toLocaleString("pt-BR")} ha adicionais · ${fmtK(custoArrendamentoAnual)}/ano`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-secondary/40 p-4 rounded">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Área Arrendada</p>
            <p className="font-display text-2xl font-bold text-navy tabular mt-1">{totalAreaArrendada.toLocaleString("pt-BR")}<span className="text-sm text-muted-foreground ml-1">ha</span></p>
          </div>
          <div className="bg-secondary/40 p-4 rounded">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Custo Anual</p>
            <p className="font-display text-2xl font-bold text-gold-dark tabular mt-1">{fmtK(custoArrendamentoAnual)}</p>
          </div>
          <div className="bg-secondary/40 p-4 rounded">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Custo Médio / ha</p>
            <p className="font-display text-2xl font-bold text-navy tabular mt-1">R$ {Math.round(custoArrendamentoAnual / totalAreaArrendada).toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contrato</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Proprietário · Cidade</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Área</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cultura</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">R$/ha</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Anual</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vigência</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Reajuste</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {areasArrendadas.map((a) => (
                <tr key={a.id} className="border-b border-border/40 hover:bg-secondary/40">
                  <td className="py-3 px-3 text-xs font-semibold text-gold-dark flex items-center gap-1.5">
                    <Handshake className="h-3.5 w-3.5" /> {a.id}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-sm font-medium text-navy">{a.proprietario}</p>
                    <p className="text-xs text-muted-foreground">{a.cidade}</p>
                  </td>
                  <td className="py-3 px-3 text-right tabular font-semibold text-navy">{a.area} ha</td>
                  <td className="py-3 px-3 text-xs text-foreground">{a.cultura}</td>
                  <td className="py-3 px-3 text-right tabular text-foreground">R$ {a.custoPorHa.toLocaleString("pt-BR")}</td>
                  <td className="py-3 px-3 text-right tabular font-semibold text-gold-dark">{fmtK(a.valorAnual)}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground tabular">
                    {a.inicio} → {a.termino}
                  </td>
                  <td className="py-3 px-3 text-xs text-foreground">{a.reajusteIndice}</td>
                  <td className="py-3 px-3">
                    <Badge className={cn("text-[10px] border", ARREND_TONE[a.status])}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
