import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sprout, MapPin, DollarSign, CheckCircle2, Sparkles } from "lucide-react";
import { fmtK } from "@/data/mockAgro";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const STEPS = [
  { id: 1, title: "Identificação", icon: Sprout, description: "Cultura e safra" },
  { id: 2, title: "Área e Talhões", icon: MapPin, description: "Hectares e fazenda" },
  { id: 3, title: "Custos Estimados", icon: DollarSign, description: "Investimento por categoria" },
  { id: 4, title: "Revisão", icon: CheckCircle2, description: "Confirmar dados" },
];

export function NovaSafraWizard({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    cultura: "Soja",
    safra: "2025/26",
    hectares: 420,
    fazenda: "Fazenda São João",
    talhao: "T-12 / T-15",
    sementes: 380,
    fertilizantes: 720,
    defensivos: 540,
    operacoes: 280,
    arrendamento: 120,
    outros: 90,
  });

  const totalPorHa = data.sementes + data.fertilizantes + data.defensivos + data.operacoes + data.arrendamento + data.outros;
  const totalSafra = totalPorHa * data.hectares;
  const receitaEsperada = data.hectares * 65 * 130; // 65 sc/ha · R$ 130/sc
  const margem = receitaEsperada - totalSafra;

  const reset = () => { setStep(1); };
  const close = () => { onOpenChange(false); setTimeout(reset, 300); };

  const finalizar = () => {
    toast.success(`Safra ${data.cultura} ${data.safra} cadastrada`, {
      description: `${data.hectares} ha · custo total ${fmtK(totalSafra)}`,
    });
    close();
  };

  const setField = <K extends keyof typeof data>(k: K, v: typeof data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const progress = (step / STEPS.length) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <Badge className="w-fit text-[10px] uppercase tracking-[0.2em] bg-gold/10 text-gold-dark border border-gold/30">
            Wizard · Nova Safra
          </Badge>
          <SheetTitle className="font-display text-2xl text-navy">
            {STEPS[step - 1].title}
          </SheetTitle>
          <SheetDescription>{STEPS[step - 1].description}</SheetDescription>
          <div className="pt-3">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              <span>Etapa {step} de {STEPS.length}</span>
              <span className="tabular">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </SheetHeader>

        <div className="py-6 space-y-4 min-h-[340px]">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="cultura">Cultura</Label>
                <select
                  id="cultura"
                  value={data.cultura}
                  onChange={(e) => setField("cultura", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5"
                >
                  <option>Soja</option>
                  <option>Milho</option>
                  <option>Algodão</option>
                  <option>Sorgo</option>
                </select>
              </div>
              <div>
                <Label htmlFor="safra">Safra</Label>
                <Input id="safra" value={data.safra} onChange={(e) => setField("safra", e.target.value)} className="mt-1.5" />
              </div>
              <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded">
                💡 A Melazzo IA pré-carregará os custos médios da região com base na cultura selecionada.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="hectares">Hectares plantados</Label>
                <Input id="hectares" type="number" value={data.hectares} onChange={(e) => setField("hectares", Number(e.target.value))} className="mt-1.5 tabular" />
              </div>
              <div>
                <Label htmlFor="fazenda">Fazenda</Label>
                <select
                  id="fazenda"
                  value={data.fazenda}
                  onChange={(e) => setField("fazenda", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5"
                >
                  <option>Fazenda São João</option>
                  <option>Fazenda Alvorada</option>
                  <option>Fazenda Boa Vista</option>
                </select>
              </div>
              <div>
                <Label htmlFor="talhao">Talhões</Label>
                <Input id="talhao" value={data.talhao} onChange={(e) => setField("talhao", e.target.value)} placeholder="Ex.: T-12 / T-15" className="mt-1.5" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-xs text-muted-foreground mb-2">Valores em R$ por hectare:</p>
              {[
                { k: "sementes" as const, label: "Sementes" },
                { k: "fertilizantes" as const, label: "Fertilizantes" },
                { k: "defensivos" as const, label: "Defensivos" },
                { k: "operacoes" as const, label: "Operações Mecanizadas" },
                { k: "arrendamento" as const, label: "Arrendamento" },
                { k: "outros" as const, label: "Outros (seguro, frete, etc.)" },
              ].map(({ k, label }) => (
                <div key={k} className="flex items-center gap-3">
                  <Label className="flex-1 text-xs">{label}</Label>
                  <span className="text-xs text-muted-foreground">R$</span>
                  <Input type="number" value={data[k]} onChange={(e) => setField(k, Number(e.target.value))} className="w-28 h-9 tabular text-right" />
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-navy">Total por hectare</span>
                <span className="font-display text-lg font-bold text-gold-dark tabular">R$ {totalPorHa.toLocaleString("pt-BR")}</span>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="navy-card p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{data.cultura} · Safra {data.safra}</p>
                    <p className="font-display text-xl font-bold text-linen mt-1">{data.fazenda}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-linen/10">
                  <div>
                    <p className="text-[10px] text-linen/60 uppercase tracking-wider">Área</p>
                    <p className="font-display text-base text-linen tabular">{data.hectares} ha</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-linen/60 uppercase tracking-wider">Talhões</p>
                    <p className="font-display text-base text-linen">{data.talhao}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-linen/60 uppercase tracking-wider">Custo Total</p>
                    <p className="font-display text-base text-gold tabular">{fmtK(totalSafra)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-linen/60 uppercase tracking-wider">Margem Esperada</p>
                    <p className="font-display text-base text-finance-positive tabular">{fmtK(margem)}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded">
                Receita estimada: 65 sc/ha × R$ 130/saca × {data.hectares} ha = <strong className="text-navy">{fmtK(receitaEsperada)}</strong>. Margem bruta projetada de <strong className="text-positive">{((margem / receitaEsperada) * 100).toFixed(1)}%</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => step === 1 ? close() : setStep(step - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            {step === 1 ? "Cancelar" : "Voltar"}
          </Button>
          {step < STEPS.length ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              Próxima <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={finalizar} className="bg-gold hover:bg-gold-dark text-navy">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Cadastrar Safra
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
