import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  empresa, kpisVisaoGeral, aging, evolucaoMensal, juridico,
  insightsIA, equipe, fmt, fmtK,
} from "@/data/mockCobranca";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText } from "lucide-react";

export default function Dossie() {
  const totalCarteira = aging.reduce((s, a) => s + a.valor, 0);
  const totalPDD = aging.reduce((s, a) => s + a.pdd, 0);
  const inadimplente = aging.filter((a) => a.faixa !== "A vencer").reduce((s, a) => s + a.valor, 0);
  const recuperadoMes = evolucaoMensal[evolucaoMensal.length - 1].recuperado;
  const totalRecuperadoEquipe = equipe.reduce((s, e) => s + e.recuperado, 0);

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Relatório Executivo"
          title="Dossiê de Cobrança"
          description="Relatório consolidado pronto para apresentação ao comitê de crédito ou diretoria."
          actions={
            <>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5 mr-1.5" /> Imprimir
              </Button>
              <Button size="sm" className="text-xs bg-cobranca hover:bg-cobranca/90 text-white">
                <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
              </Button>
            </>
          }
        />
      </div>

      {/* Capa */}
      <div className="navy-card p-8 print:bg-white print:text-navy print:border-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-2">Melazzo Consultoria</p>
            <h1 className="font-display text-3xl font-semibold text-linen leading-tight">Dossiê de Cobrança</h1>
            <p className="text-sm text-linen/70 mt-2">Posição consolidada · {empresa.nome}</p>
          </div>
          <FileText className="h-10 w-10 text-gold/60" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gold/20">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-linen/50">Cliente</p>
            <p className="font-medium text-linen mt-1">{empresa.nome}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-linen/50">Segmento</p>
            <p className="font-medium text-linen mt-1">{empresa.segmento}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-linen/50">Carteira ativa</p>
            <p className="font-medium text-linen mt-1 tabular">{fmtK(empresa.carteiraAtiva)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-linen/50">Data emissão</p>
            <p className="font-medium text-linen mt-1">{new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>

      {/* Sumário Executivo */}
      <SectionCard title="1. Sumário Executivo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm leading-relaxed text-foreground">
              A {empresa.nome} encerra o mês com carteira ativa de <strong className="text-navy">{fmt(empresa.carteiraAtiva)}</strong> distribuída
              em {empresa.contratos.toLocaleString("pt-BR")} contratos. A taxa de inadimplência de <strong className="text-cobranca">{empresa.inadimplencia}%</strong> permanece abaixo
              do benchmark do setor (11,2%), com tendência de queda nos últimos 4 meses graças à régua de cobrança automatizada
              e à equipe de {empresa.equipe} operadores que recuperou <strong className="text-positive">{fmt(recuperadoMes)}</strong> no período.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-secondary/40 rounded text-sm">
              <span className="text-muted-foreground">Inadimplência total</span>
              <span className="tabular font-semibold text-cobranca">{fmt(inadimplente)}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/40 rounded text-sm">
              <span className="text-muted-foreground">PDD acumulada</span>
              <span className="tabular font-semibold text-navy">{fmt(totalPDD)}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/40 rounded text-sm">
              <span className="text-muted-foreground">Recuperação mês</span>
              <span className="tabular font-semibold text-positive">{fmt(recuperadoMes)}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/40 rounded text-sm">
              <span className="text-muted-foreground">Em fase judicial</span>
              <span className="tabular font-semibold text-navy">{fmt(juridico.valorEmDisputa)}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Indicadores */}
      <SectionCard title="2. Indicadores-chave">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpisVisaoGeral.map((k) => (
            <div key={k.label} className="p-4 bg-card border border-border rounded">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</p>
              <p className="font-display text-xl font-bold text-navy mt-1 tabular">
                {k.format === "pct" ? `${k.value}%` : fmtK(k.value)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Aging */}
      <SectionCard title="3. Aging Report">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Faixa</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contratos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">PDD</th>
              </tr>
            </thead>
            <tbody>
              {aging.map((a) => (
                <tr key={a.faixa} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium text-navy">{a.faixa}</td>
                  <td className="py-2 px-3 text-right tabular">{a.contratos.toLocaleString("pt-BR")}</td>
                  <td className="py-2 px-3 text-right tabular font-semibold text-navy">{fmt(a.valor)}</td>
                  <td className="py-2 px-3 text-right tabular text-cobranca">{a.pdd > 0 ? fmt(a.pdd) : "—"}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-cobranca">
                <td className="py-2 px-3 font-bold text-navy">Total</td>
                <td className="py-2 px-3 text-right tabular font-bold">{aging.reduce((s, a) => s + a.contratos, 0).toLocaleString("pt-BR")}</td>
                <td className="py-2 px-3 text-right tabular font-bold text-navy">{fmt(totalCarteira)}</td>
                <td className="py-2 px-3 text-right tabular font-bold text-cobranca">{fmt(totalPDD)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Performance Equipe */}
      <SectionCard title="4. Performance da Equipe">
        <p className="text-sm text-foreground mb-3">
          Equipe de <strong>{empresa.equipe} operadores</strong> recuperou <strong className="text-positive">{fmt(totalRecuperadoEquipe)}</strong> no mês,
          com taxa média de conversão de <strong>{((equipe.reduce((s, e) => s + e.acordos, 0) / equipe.reduce((s, e) => s + e.contatos, 0)) * 100).toFixed(1)}%</strong>.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {equipe.slice(0, 6).map((op) => (
            <div key={op.iniciais} className="p-3 bg-card border border-border rounded flex items-center justify-between">
              <div>
                <p className="font-medium text-navy text-sm">{op.nome}</p>
                <p className="text-[10px] text-muted-foreground">{op.acordos} acordos · {op.taxa}% conversão</p>
              </div>
              <p className="tabular font-semibold text-navy text-sm">{fmtK(op.recuperado)}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Insights */}
      <SectionCard title="5. Recomendações Estratégicas (Inteligência Melazzo)">
        <div className="space-y-3">
          {insightsIA.map((ins, i) => (
            <div key={ins.titulo} className="p-4 bg-card border-l-4 border-l-gold border border-border rounded">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-navy text-sm">{i + 1}. {ins.titulo}</p>
                <span className="badge-gold shrink-0">{ins.impacto}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.descricao}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-semibold">Melazzo Consultoria</p>
        <p className="text-xs text-muted-foreground mt-1">Documento confidencial · Versão demonstrativa</p>
      </div>
    </div>
  );
}
