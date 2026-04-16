import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, LineChart,
  Wallet, Target, CreditCard, Loader2,
} from "lucide-react";
import { useState } from "react";
import RuralNavbar from "@/components/rural/RuralNavbar";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import { applySeo } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const features = [
  { icon: LineChart, title: "Visão temporal completa", desc: "Acompanhe receitas, despesas e resultado em 3, 6, 12 meses ou YTD." },
  { icon: Wallet, title: "Patrimônio líquido automático", desc: "Liquidez + investimentos + imobilizado − passivos, sempre atualizado." },
  { icon: Target, title: "Orçamento base zero", desc: "Defina limites por categoria e veja em tempo real onde você está." },
  { icon: CreditCard, title: "Cartões e parcelamentos", desc: "Cada parcela cai automaticamente no mês certo do seu fluxo." },
  { icon: ShieldCheck, title: "Health Score 0–100", desc: "Indicador único que mede liquidez, dívida, poupança e disciplina." },
  { icon: Sparkles, title: "Acompanhamento consultivo", desc: "Notas e planos de ação registrados pela Melazzo dentro do sistema." },
];

const faqs = [
  { q: "Como funciona o acesso?", a: "Após o pagamento, você recebe um e-mail com o link para criar sua senha e acessar o Sistema Melazzo imediatamente." },
  { q: "Posso cancelar quando quiser?", a: "Sim. O plano mensal pode ser cancelado a qualquer momento. Há garantia de 7 dias com reembolso integral em qualquer plano." },
  { q: "Qual a diferença entre mensal e anual?", a: "O plano mensal é R$ 39,90/mês com renovação automática. O anual é R$ 450 à vista (equivale a R$ 37,50/mês) e dá 12 meses de acesso." },
  { q: "Meus dados estão seguros?", a: "Sim. Usamos infraestrutura criptografada e RLS de nível bancário. Apenas você e o seu consultor enxergam seus dados." },
  { q: "Tem suporte?", a: "Sim. Suporte por WhatsApp e e-mail em horário comercial, mais o acompanhamento consultivo embutido na plataforma." },
];

const Planilha = () => {
  const [plan, setPlan] = useState<"mensal" | "anual">("anual");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applySeo({
      title: "Sistema Melazzo | Plataforma de Gestão Financeira Pessoal",
      description: "Pare de tentar entender suas finanças no escuro. Sistema Melazzo: Health Score, orçamento base zero, patrimônio e acompanhamento consultivo. A partir de R$ 39,90/mês.",
      canonical: "https://melazzo.co/planilha",
      ogType: "product",
    });
    trackEvent("ViewContent", { content_name: "Sistema Melazzo", content_category: "subscription" });
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    trackEvent("InitiateCheckout", {
      content_name: "Sistema Melazzo",
      currency: "BRL",
      value: plan === "anual" ? 450 : 39.9,
    });
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan, email },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (err) {
      toast({
        title: "Não foi possível iniciar o checkout",
        description: "Tente novamente em instantes ou fale com a gente pelo WhatsApp.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <a href="#planos" className="skip-to-content">Pular para os planos</a>
      <RuralNavbar variant="default" />

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-navy overflow-hidden">
        <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-gold/25" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-gold/25" />

        <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/30 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">
                Sistema Melazzo · Acesso direto
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Sua vida financeira com{" "}
              <span className="italic text-gradient-gold">clareza cirúrgica</span>
            </h1>
            <p className="font-body text-lg text-primary-foreground/70 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              A plataforma que une fluxo de caixa, patrimônio, orçamento e Health Score em
              um único lugar — com a Melazzo Consultoria ao seu lado dentro do sistema.
            </p>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Ver planos e começar
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">
              O que você recebe
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Tudo que você precisa para tomar decisões com segurança
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 border border-foreground/10 bg-card hover:border-gold/30 transition-colors"
              >
                <f.icon className="w-7 h-7 text-gold mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 lg:py-28 bg-gradient-navy">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">
              Escolha seu plano
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight mb-4">
              Comece hoje. Cancele quando quiser.
            </h2>
            <p className="font-body text-sm text-primary-foreground/60 font-light">
              Garantia de 7 dias com reembolso integral em qualquer plano.
            </p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPlan("mensal")}
                className={`p-6 text-left border transition-all ${
                  plan === "mensal"
                    ? "border-gold bg-gold/5"
                    : "border-primary-foreground/15 bg-primary-foreground/[0.02] hover:border-primary-foreground/30"
                }`}
              >
                <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">
                  Mensal
                </p>
                <p className="font-display text-3xl font-bold text-primary-foreground mb-1">
                  R$ 39,90<span className="text-base font-normal text-primary-foreground/50">/mês</span>
                </p>
                <p className="font-body text-xs text-primary-foreground/55 mt-3">
                  Renovação automática. Cancele quando quiser.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPlan("anual")}
                className={`relative p-6 text-left border transition-all ${
                  plan === "anual"
                    ? "border-gold bg-gold/5"
                    : "border-primary-foreground/15 bg-primary-foreground/[0.02] hover:border-primary-foreground/30"
                }`}
              >
                <span className="absolute -top-3 right-4 px-2 py-0.5 bg-gradient-gold text-primary font-body text-[9px] tracking-[0.2em] uppercase font-bold">
                  Economize 6%
                </span>
                <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">
                  Anual
                </p>
                <p className="font-display text-3xl font-bold text-primary-foreground mb-1">
                  R$ 450<span className="text-base font-normal text-primary-foreground/50"> à vista</span>
                </p>
                <p className="font-body text-xs text-primary-foreground/55 mt-3">
                  12 meses de acesso. Equivale a R$ 37,50/mês.
                </p>
              </button>
            </div>

            <div>
              <label className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                Seu e-mail (será o seu login)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-primary-foreground/5 border border-primary-foreground/15 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-12 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Preparando…</>
              ) : (
                <>Comprar com Pix ou Cartão <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center font-body text-xs text-primary-foreground/40 leading-relaxed">
              Pagamento seguro processado pela Stripe · Pix e cartão de crédito ·
              Garantia de 7 dias
            </p>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">
              Perguntas frequentes
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Dúvidas comuns
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group border border-foreground/10 bg-card p-5 hover:border-gold/30 transition-colors"
              >
                <summary className="font-display text-base font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <ArrowRight className="w-4 h-4 text-gold transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed font-light">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 border border-gold/25 bg-gold/5 text-center">
            <CheckCircle2 className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="font-display text-base font-semibold text-foreground mb-1">
              Garantia incondicional de 7 dias
            </p>
            <p className="font-body text-sm text-muted-foreground font-light">
              Não gostou? Reembolso integral, sem perguntas. Veja a{" "}
              <Link to="/politica-reembolso" className="text-accent underline underline-offset-2">
                política de reembolso
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <SiteChrome />
    </div>
  );
};

export default Planilha;
