import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { reguaCobranca } from "@/data/mockCobranca";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Mail, Phone, FileText, Bell, Scale, MailQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/hooks/use-drill-down";
import { cobrancaDrills } from "@/data/drillBuilders";
import { KpiCard } from "@/components/ui/kpi-card";

const canalIcon: Record<string, any> = {
  SMS: MessageSquare,
  WhatsApp: MessageSquare,
  "E-mail": Mail,
  Ligação: Phone,
  Carta: FileText,
  Serasa: Bell,
  Jurídico: Scale,
};

const canalColor: Record<string, string> = {
  SMS: "bg-finance-neutral/10 text-finance-neutral border-finance-neutral/30",
  WhatsApp: "bg-finance-positive/10 text-finance-positive border-finance-positive/30",
  "E-mail": "bg-gold/10 text-gold-dark border-gold/30",
  Ligação: "bg-navy/10 text-navy border-navy/30",
  Carta: "bg-finance-warning/10 text-finance-warning border-finance-warning/30",
  Serasa: "bg-cobranca/10 text-cobranca border-cobranca/30",
  Jurídico: "bg-finance-negative/10 text-finance-negative border-finance-negative/30",
};

export default function ReguaCobranca() {
  const { openDrill } = useDrillDown();
  const taxaMedia = reguaCobranca.reduce((s, r) => s + r.taxa, 0) / reguaCobranca.length;
  const custoTotal = reguaCobranca.reduce((s, r) => s + r.custo, 0);
  const drillRegua = () => openDrill(cobrancaDrills.reguaDrill());

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Régua de Cobrança"
        description="Sequência automatizada de ações por canal e estágio do atraso. Edite, ative e teste cenários."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Estágios ativos" value={`${reguaCobranca.filter((r) => r.ativa).length}/${reguaCobranca.length}`} highlight onClick={drillRegua} />
        <KpiCard label="Taxa média de resposta" value={`${taxaMedia.toFixed(0)}%`} onClick={drillRegua} />
        <KpiCard label="Custo total por contrato" value={`R$ ${custoTotal.toFixed(2)}`} onClick={drillRegua} />
      </div>

      <SectionCard title="Linha do tempo" subtitle="Sequência de ações executadas automaticamente">
        <div className="relative">
          {/* linha vertical */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-cobranca via-gold to-finance-negative/40" />

          <div className="space-y-4">
            {reguaCobranca.map((etapa, i) => {
              const Icon = canalIcon[etapa.canal] || MailQuestion;
              return (
                <div key={i} className="relative flex items-start gap-4 pl-0">
                  <div className={cn(
                    "relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 bg-background",
                    canalColor[etapa.canal]
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 melazzo-card p-4 -ml-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-cobranca font-semibold tracking-wider bg-cobranca-pale px-1.5 py-0.5 rounded">
                            {etapa.dia}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            {etapa.canal}
                          </span>
                        </div>
                        <p className="font-medium text-navy text-sm">{etapa.titulo}</p>

                        <div className="flex items-center gap-4 mt-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Taxa de resposta:</span>
                            <span className={cn(
                              "tabular font-semibold",
                              etapa.taxa >= 40 ? "text-positive" : etapa.taxa >= 25 ? "text-foreground" : "text-warning"
                            )}>
                              {etapa.taxa}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Custo:</span>
                            <span className="tabular font-semibold text-navy">R$ {etapa.custo.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Switch defaultChecked={etapa.ativa} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
