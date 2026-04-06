import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  onNext: () => void;
}

const OnboardingWelcome = ({ onNext }: Props) => (
  <>
    <CardHeader className="text-center pb-2">
      <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
        <Sparkles className="h-8 w-8 text-accent" />
      </div>
      <CardTitle className="text-2xl font-display">Bem-vindo à sua plataforma</CardTitle>
    </CardHeader>
    <CardContent className="text-center space-y-4">
      <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
        Para construirmos juntos um futuro financeiro sólido, precisamos entender seu cenário atual.
        O processo é dividido em <strong className="text-accent">6 etapas curtas</strong>, como uma conversa
        organizada sobre sua vida financeira. Cada etapa leva de 3 a 5 minutos.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg mx-auto text-left">
        {[
          "1. Dados Pessoais",
          "2. Renda",
          "3. Moradia",
          "4. Despesas do Dia a Dia",
          "5. Patrimônio e Dívidas",
          "6. Perfil Específico",
        ].map((s) => (
          <span key={s} className="text-xs font-body text-muted-foreground bg-secondary rounded px-2 py-1.5">
            {s}
          </span>
        ))}
      </div>
      <Button onClick={onNext} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90 mt-2">
        Começar Onboarding <ArrowRight className="h-4 w-4" />
      </Button>
    </CardContent>
  </>
);

export default OnboardingWelcome;
