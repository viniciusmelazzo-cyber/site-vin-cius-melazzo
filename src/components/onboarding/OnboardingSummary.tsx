import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
  saving: boolean;
}

const OnboardingSummary = ({ onComplete, saving }: Props) => (
  <>
    <CardHeader className="text-center pb-2">
      <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
        <CheckCircle2 className="h-8 w-8 text-accent" />
      </div>
      <CardTitle className="text-2xl font-display">Onboarding Concluído!</CardTitle>
    </CardHeader>
    <CardContent className="text-center space-y-4">
      <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
        Obrigado por compartilhar suas informações. Nossa equipe já está analisando seus dados para construir
        sua <strong className="text-accent">teia de informações</strong> personalizada — uma visão completa
        da sua vida financeira que nos permitirá encontrar as melhores soluções para você.
      </p>
      <div className="bg-secondary rounded-lg p-4 text-left max-w-md mx-auto space-y-2">
        <h4 className="font-display text-sm font-semibold">Próximos passos:</h4>
        <ul className="text-xs font-body text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" /> Análise dos seus dados pela equipe</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" /> Construção do seu painel de saúde financeira</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" /> Identificação de oportunidades e recomendações</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" /> Contato do seu consultor para primeira reunião</li>
        </ul>
      </div>
      <Button onClick={onComplete} disabled={saving} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
        {saving ? "Salvando..." : "Ir para o Dashboard"} <ArrowRight className="h-4 w-4" />
      </Button>
    </CardContent>
  </>
);

export default OnboardingSummary;
