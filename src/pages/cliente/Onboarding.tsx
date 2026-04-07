import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingSummary from "@/components/onboarding/OnboardingSummary";
import { type OnboardingData, defaultOnboardingData } from "@/components/onboarding/types";

const TOTAL_STEPS = 8; // 0=welcome, 1-6=steps, 7=summary

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(partial)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          (next as any)[key] = { ...(prev as any)[key], ...value };
        } else {
          (next as any)[key] = value;
        }
      }
      return next;
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveProgress = async () => {
    if (!user) return;
    try {
      await supabase.from("onboarding_data").upsert({
        user_id: user.id,
        personal_data: data.personal_data as any,
        activity_type: data.activity_type || null,
        income_data: data.income_data as any,
        housing_data: data.housing_data as any,
        expenses_data: data.expenses_data as any,
        assets_liabilities_data: data.assets_liabilities_data as any,
        profile_module_data: data.profile_module_data as any,
        onboarding_step: step,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: "user_id" });
      toast({ title: "Progresso salvo!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const p = data.personal_data;
      await supabase.from("profiles").update({
        cpf: p.cpf || null,
        company_name: p.full_name || null,
        phone: p.telefone || null,
        sector: data.activity_type || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);

      await supabase.from("onboarding_data").upsert({
        user_id: user.id,
        personal_data: data.personal_data as any,
        activity_type: data.activity_type || null,
        income_data: data.income_data as any,
        housing_data: data.housing_data as any,
        expenses_data: data.expenses_data as any,
        assets_liabilities_data: data.assets_liabilities_data as any,
        profile_module_data: data.profile_module_data as any,
        onboarding_step: TOTAL_STEPS - 1,
        goals: "",
        updated_at: new Date().toISOString(),
      } as any, { onConflict: "user_id" });

      // Notify admin
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "onboarding_complete",
        title: "Novo cliente completou o onboarding",
        message: `${data.personal_data.full_name || "Cliente"} finalizou o cadastro.`,
      } as any);

      await refreshProfile();
      toast({ title: "Onboarding concluído!" });
      navigate("/cliente/dashboard", { replace: true });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const stepContent: Record<number, React.ReactNode> = {
    0: <OnboardingWelcome onNext={next} />,
    1: <OnboardingStep1 data={data} onChange={updateData} />,
    2: <OnboardingStep2 data={data} onChange={updateData} />,
    3: <OnboardingStep3 data={data} onChange={updateData} />,
    4: <OnboardingStep4 data={data} onChange={updateData} />,
    5: <OnboardingStep5 data={data} onChange={updateData} />,
    6: <OnboardingStep6 data={data} onChange={updateData} />,
    7: <OnboardingSummary onComplete={handleComplete} saving={saving} />,
  };

  return (
    <div className="min-h-screen bg-linen-texture flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoVM} alt="" className="w-7 h-7 object-contain" />
          <div>
            <h1 className="text-lg font-display font-bold text-primary">Melazzo</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-body">Onboarding</p>
          </div>
        </div>
        {step > 0 && step < 7 && (
          <Button variant="ghost" size="sm" onClick={saveProgress} className="font-body text-xs gap-1.5 text-muted-foreground hover:text-accent">
            <Save className="h-3.5 w-3.5" /> Salvar progresso
          </Button>
        )}
      </header>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <OnboardingProgress currentStep={step} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <Card className="w-full max-w-3xl border-border shadow-lg animate-fade-in">
          {stepContent[step]}

          {/* Navigation */}
          {step > 0 && step < 7 && (
            <div className="px-6 pb-6 flex justify-between">
              <Button variant="ghost" onClick={back} className="font-body gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button onClick={next} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                {step === 6 ? "Concluir" : "Próximo"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
