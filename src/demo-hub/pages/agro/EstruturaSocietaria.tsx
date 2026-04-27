import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { estruturaSocietaria, fmtK } from "@/data/mockAgro";
import {
  Building2, User, Users, Crown, Scale, FileText, ArrowDown, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/hooks/use-drill-down";

export default function EstruturaSocietaria() {
  const { holding, operacional, socios, processos } = estruturaSocietaria;
  const { openDrill } = useDrillDown();

  const totalParticipacao = socios.reduce((s, x) => s + x.participacao, 0);
  const coobrigados = socios.filter((s) => s.coobrigado).length;
  const processosAtivos = processos.length;

  const verSocios = () =>
    openDrill({
      title: "Sócios da Holding",
      subtitle: `${socios.length} sócios · ${coobrigados} coobrigados em operações de crédito`,
      kpis: [
        { label: "Total de sócios", value: String(socios.length) },
        { label: "Coobrigados", value: String(coobrigados) },
        { label: "Participação total", value: `${totalParticipacao}%` },
      ],
      columns: [
        { key: "nome", label: "Sócio" },
        { key: "papel", label: "Papel" },
        { key: "participacao", label: "Participação", align: "right", format: (v: number) => `${v}%` },
        { key: "desde", label: "Desde", align: "right" },
        { key: "coobrigado", label: "Coobrig.", align: "center", format: (v: boolean) => (v ? "Sim" : "Não") },
        { key: "processos", label: "Processos", align: "right" },
      ],
      rows: socios,
    });

  const verProcessos = () =>
    openDrill({
      title: "Processos Judiciais",
      subtitle: "Processos vinculados a sócios e empresas do grupo",
      kpis: [
        { label: "Processos ativos", value: String(processosAtivos) },
        { label: "Valor envolvido", value: fmtK(processos.reduce((s, p) => s + p.valor, 0)) },
      ],
      columns: [
        { key: "numero", label: "Nº do processo" },
        { key: "tipo", label: "Tipo" },
        { key: "vara", label: "Vara" },
        { key: "valor", label: "Valor", align: "right", format: (v: number) => fmtK(v) },
        { key: "socioRelacionado", label: "Sócio" },
        { key: "status", label: "Status", align: "center" },
      ],
      rows: processos,
    });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Crédito & Compliance"
        title="Estrutura Societária"
        description={`Mapeamento dos proponentes, papéis e participações do grupo "${holding.nome.split(" ")[0]}"`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Empresas" value="2" icon={<Building2 className="h-4 w-4" />} highlight />
        <KpiCard
          label="Sócios"
          value={String(socios.length)}
          icon={<Users className="h-4 w-4" />}
          onClick={verSocios}
        />
        <KpiCard
          label="Coobrigados"
          value={String(coobrigados)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          onClick={verSocios}
        />
        <KpiCard
          label="Processos Ativos"
          value={String(processosAtivos)}
          icon={<Scale className="h-4 w-4" />}
          onClick={verProcessos}
          inverse
        />
      </div>

      {/* Diagrama Hierárquico */}
      <SectionCard title="Diagrama Societário" subtitle="Hierarquia Holding → Operacional → Sócios">
        <div className="flex flex-col items-center gap-3 py-4">
          {/* Holding */}
          <div className="navy-card p-5 w-full max-w-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-gold" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Holding</span>
            </div>
            <p className="font-display text-lg font-semibold text-linen">{holding.nome}</p>
            <p className="text-xs text-linen/60 mt-1 tabular">CNPJ {holding.cnpj}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-linen/10">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/60">Constituição</p>
                <p className="text-sm font-semibold text-linen tabular">{holding.constituicao}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/60">Capital Social</p>
                <p className="text-sm font-semibold text-gold tabular">{fmtK(holding.capitalSocial)}</p>
              </div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-gold-dark" />

          {/* Operacional */}
          <div className="melazzo-card p-5 w-full max-w-md text-center border-gold/40">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-gold-dark" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-dark">Operacional · 100% controlada</span>
            </div>
            <p className="font-display text-lg font-semibold text-navy">{operacional.nome}</p>
            <p className="text-xs text-muted-foreground mt-1 tabular">CNPJ {operacional.cnpj}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Constituição</p>
                <p className="text-sm font-semibold text-navy tabular">{operacional.constituicao}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Capital Social</p>
                <p className="text-sm font-semibold text-navy tabular">{fmtK(operacional.capitalSocial)}</p>
              </div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-gold-dark" />

          {/* Sócios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {socios.map((s) => (
              <button
                key={s.nome}
                onClick={verSocios}
                className="melazzo-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-gold/10 grid place-items-center">
                      <User className="h-4 w-4 text-gold-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy leading-tight">{s.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{s.cpf}</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "text-[10px] shrink-0",
                      s.coobrigado
                        ? "bg-positive/10 text-positive hover:bg-positive/10 border-positive/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {s.coobrigado ? "Coobrigado" : "Não"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Papel</p>
                    <p className="text-xs font-medium text-foreground">{s.papel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Participação</p>
                      <p className="text-base font-display font-semibold text-gold-dark tabular">{s.participacao}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Desde</p>
                      <p className="text-sm font-semibold text-navy tabular">{s.desde}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Processos */}
      <SectionCard
        title="Processos Judiciais Vinculados"
        subtitle={processosAtivos > 0 ? "Atenção: existem processos em andamento" : "Nenhum processo ativo"}
        icon={<FileText className="h-4 w-4" />}
      >
        {processos.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-positive/5 border border-positive/30 rounded">
            <CheckCircle2 className="h-5 w-5 text-positive shrink-0" />
            <p className="text-sm text-foreground">Nenhum processo identificado em consulta às bases públicas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Nº do Processo</th>
                  <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tipo</th>
                  <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vara</th>
                  <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                  <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sócio</th>
                  <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {processos.map((p) => (
                  <tr key={p.numero} className="border-b border-border/40 hover:bg-secondary/30">
                    <td className="py-2.5 px-3 tabular text-xs font-medium text-navy">{p.numero}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="outline" className="text-[10px]">{p.tipo}</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-foreground">{p.vara}</td>
                    <td className="py-2.5 px-3 text-right tabular font-semibold text-foreground">{fmtK(p.valor)}</td>
                    <td className="py-2.5 px-3 text-xs text-foreground">{p.socioRelacionado}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-[10px] gap-1">
                        <AlertTriangle className="h-2.5 w-2.5" /> Em andamento
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
