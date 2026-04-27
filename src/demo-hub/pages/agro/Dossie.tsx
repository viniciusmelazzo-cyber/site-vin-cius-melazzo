import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import {
  fazenda, kpisVisaoExecutiva, totalLastro, lastroPatrimonial,
  totalDividas, custoMedioDivida, dividasAgro, capacidadePagamento,
  pecuaria, totalRebanhoValor, custeioSafra, riscoCredito,
  fmt, fmtK,
} from "@/data/mockAgro";
import { Download, FileText, Sprout, Beef, Landmark, ShieldCheck, MapPin, Building2 } from "lucide-react";

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="break-inside-avoid">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded bg-agro-pale text-agro">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display text-base font-semibold text-navy">{title}</h3>
        <div className="flex-1 h-px bg-gold/30 ml-2" />
      </div>
      {children}
    </div>
  );
}

function Linha({ label, valor, destaque }: { label: string; valor: string; destaque?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${destaque ? "border-t border-gold mt-1 pt-2" : ""}`}>
      <span className={`text-sm ${destaque ? "font-semibold text-navy" : "text-foreground"}`}>{label}</span>
      <span className={`tabular text-sm ${destaque ? "font-bold text-navy" : "text-navy"}`}>{valor}</span>
    </div>
  );
}

export default function Dossie() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Análise Consolidada"
        title="Dossiê Executivo"
        description="Visão consolidada do produtor para apresentação a instituições financeiras, parceiros e investidores."
        actions={
          <Button onClick={() => window.print()} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
        }
      />

      {/* Capa */}
      <div className="navy-card p-8 md:p-12">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">Dossiê Patrimonial e Financeiro</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-linen leading-tight">
              {fazenda.nome}
            </h1>
            <p className="text-linen/70 mt-2">{fazenda.proprietario}</p>
            <div className="divider-gold w-32 mt-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/50">Localização</p>
                <p className="text-sm text-linen mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold" /> {fazenda.cidade}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/50">Área Total</p>
                <p className="text-sm text-linen mt-1">{fazenda.area.toLocaleString("pt-BR")} ha</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/50">Operação</p>
                <p className="text-sm text-linen mt-1">{fazenda.segmento}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-linen/50">CAR</p>
                <p className="text-sm text-linen mt-1 font-mono text-xs">{fazenda.car}</p>
              </div>
            </div>
          </div>
          <FileText className="h-16 w-16 text-gold/30" />
        </div>
      </div>

      {/* Sumário executivo */}
      <SectionCard title="Sumário Executivo" subtitle="Indicadores-chave da operação">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpisVisaoExecutiva.map((k) => (
            <div key={k.label} className="text-center p-4 bg-secondary/40 rounded">
              <p className="kpi-label">{k.label}</p>
              <p className="font-display text-2xl font-bold text-navy tabular mt-2">
                {k.format === "pct" ? `${k.value}%` : fmtK(k.value)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Detalhes por seção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Patrimônio Bruto">
          <Section icon={Landmark} title="Composição do Lastro">
            <div className="space-y-1">
              {lastroPatrimonial.composicao.slice(0, 4).map((c) => (
                <Linha key={c.categoria} label={c.categoria} valor={fmtK(c.valor)} />
              ))}
              <Linha label="Patrimônio Total" valor={fmt(totalLastro)} destaque />
            </div>
          </Section>
        </SectionCard>

        <SectionCard title="Endividamento">
          <Section icon={Building2} title="Carteira Bancária">
            <div className="space-y-1">
              {dividasAgro.slice(0, 4).map((d) => (
                <Linha key={d.id} label={`${d.credor} · ${d.linha}`} valor={fmtK(d.valor)} />
              ))}
              <Linha label="Dívida Total" valor={fmt(totalDividas)} destaque />
              <Linha label="Custo médio anual" valor={`${custoMedioDivida.toFixed(2)}%`} />
            </div>
          </Section>
        </SectionCard>

        <SectionCard title="Pecuária">
          <Section icon={Beef} title="Rebanho">
            <div className="space-y-1">
              <Linha label="Total de cabeças" valor={pecuaria.rebanhoTotal.toLocaleString("pt-BR")} />
              <Linha label="GMD médio" valor={`${pecuaria.gmd} kg/dia`} />
              <Linha label="Lotação média" valor={`${pecuaria.lotacaoMedia} UA/ha`} />
              <Linha label="Taxa de prenhez" valor={`${pecuaria.taxaPrenhez}%`} />
              <Linha label="Valor de mercado" valor={fmt(totalRebanhoValor)} destaque />
            </div>
          </Section>
        </SectionCard>

        <SectionCard title="Lavoura · Soja">
          <Section icon={Sprout} title={`Custeio Safra ${fazenda.safra}`}>
            <div className="space-y-1">
              <Linha label="Hectares plantados" valor={`${custeioSafra.hectares} ha`} />
              <Linha label="Produtividade esperada" valor={`${custeioSafra.produtividadeEsperada} sc/ha`} />
              <Linha label="Custo total" valor={fmt(custeioSafra.custoTotal)} />
              <Linha label="Receita projetada" valor={fmt(custeioSafra.receitaProjetada)} />
              <Linha label="Margem bruta" valor={fmt(custeioSafra.margemBrutaProjetada)} destaque />
            </div>
          </Section>
        </SectionCard>
      </div>

      {/* Capacidade de pagamento */}
      <SectionCard title="Capacidade de Pagamento" icon={<ShieldCheck className="h-5 w-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-agro-pale rounded">
            <p className="kpi-label">DSCR</p>
            <p className="font-display text-3xl font-bold text-agro tabular mt-2">{capacidadePagamento.dscr.toFixed(2)}x</p>
          </div>
          <div className="text-center p-4 bg-secondary/40 rounded">
            <p className="kpi-label">Margem Operacional</p>
            <p className="font-display text-3xl font-bold text-navy tabular mt-2">{capacidadePagamento.margemOperacional}%</p>
          </div>
          <div className="text-center p-4 bg-secondary/40 rounded">
            <p className="kpi-label">EBITDA / Dívida</p>
            <p className="font-display text-3xl font-bold text-navy tabular mt-2">{capacidadePagamento.ebitdaServicoDivida.toFixed(1)}x</p>
          </div>
          <div className="text-center p-4 bg-secondary/40 rounded">
            <p className="kpi-label">Liquidez Corrente</p>
            <p className="font-display text-3xl font-bold text-navy tabular mt-2">{capacidadePagamento.liquidezCorrente.toFixed(1)}x</p>
          </div>
        </div>
      </SectionCard>

      {/* Conclusão */}
      <div className="navy-card p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">Parecer Melazzo</p>
        <h3 className="font-display text-2xl font-semibold text-linen mb-4">Diagnóstico Consolidado</h3>
        <div className="divider-gold w-32 mb-5" />
        <p className="text-linen/85 leading-relaxed text-sm">
          A operação <strong className="text-gold">{fazenda.nome}</strong> apresenta perfil financeiro
          <strong className="text-gold"> sólido</strong>, com lastro patrimonial de {fmt(totalLastro)} e
          relação dívida/patrimônio de {((totalDividas / totalLastro) * 100).toFixed(1)}%. A capacidade
          de pagamento, mensurada pelo DSCR de {capacidadePagamento.dscr.toFixed(2)}x, supera com
          folga o patamar conservador de 1,3x exigido pelas principais instituições financeiras agro.
          O rating interno <strong className="text-gold">{riscoCredito.rating}</strong> e score Serasa
          de <strong className="text-gold">{riscoCredito.scoreSerasa}</strong> reforçam o perfil de
          risco médio-baixo, com folga de {fmtK(riscoCredito.limiteAprovado - riscoCredito.exposicaoTotal)}
          no limite de crédito aprovado.
        </p>
      </div>
    </div>
  );
}
