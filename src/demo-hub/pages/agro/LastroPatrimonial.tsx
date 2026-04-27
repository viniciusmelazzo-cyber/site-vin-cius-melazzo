import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { lastroPatrimonial, totalLastro, fmt, fmtK } from "@/data/mockAgro";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip, Legend } from "recharts";
import { Landmark } from "lucide-react";

const COLORS = [
  "hsl(var(--agro))",
  "hsl(var(--gold))",
  "hsl(var(--navy))",
  "hsl(var(--finance-positive))",
  "hsl(var(--gold-dark))",
  "hsl(var(--finance-warning))",
];

export default function LastroPatrimonial() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Patrimônio & Crédito"
        title="Lastro Patrimonial"
        description="Composição do patrimônio bruto utilizado como garantia e referência de crédito junto a instituições financeiras."
      />

      {/* Total */}
      <div className="navy-card p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-2">Patrimônio Total</p>
        <p className="font-display text-5xl md:text-6xl font-bold text-linen tabular">
          {fmt(totalLastro)}
        </p>
        <div className="divider-gold w-32 mx-auto my-4" />
        <p className="text-sm text-linen/70">
          Distribuído entre {lastroPatrimonial.composicao.length} categorias de ativos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Pizza */}
        <SectionCard title="Distribuição por Categoria" className="lg:col-span-2" icon={<Landmark className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lastroPatrimonial.composicao}
                dataKey="valor"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={2}
              >
                {lastroPatrimonial.composicao.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--gold) / 0.3)", borderRadius: 4, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {lastroPatrimonial.composicao.map((item, i) => (
              <div key={item.categoria} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground">{item.categoria}</span>
                </div>
                <span className="tabular text-navy font-semibold">{((item.valor / totalLastro) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Lista detalhada */}
        <SectionCard title="Composição Detalhada" subtitle="Categoria · Valor · Observação" className="lg:col-span-3">
          <div className="space-y-2">
            {lastroPatrimonial.composicao.map((item) => (
              <div key={item.categoria} className="flex items-center justify-between p-3 rounded bg-secondary/40 hover:bg-secondary/70 transition-colors">
                <div>
                  <p className="font-medium text-sm text-navy">{item.categoria}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.observacao}</p>
                </div>
                <p className="font-display font-bold text-navy tabular">{fmtK(item.valor)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Tabela bens */}
      <SectionCard title="Bens Cadastrados" subtitle="Inventário detalhado de imóveis, máquinas e benfeitorias">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tipo</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Descrição</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Área (ha)</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {lastroPatrimonial.bens.map((bem, i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-agro-pale text-agro font-semibold uppercase tracking-wider">
                      {bem.tipo}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-foreground">{bem.descricao}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{bem.area || "—"}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(bem.valor)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={
                      bem.situacao === "Quitada" || bem.situacao === "Quitado"
                        ? "badge-positive"
                        : bem.situacao.includes("Hipot") || bem.situacao.includes("Alien")
                        ? "badge-warning"
                        : "badge-gold"
                    }>
                      {bem.situacao}
                    </span>
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
