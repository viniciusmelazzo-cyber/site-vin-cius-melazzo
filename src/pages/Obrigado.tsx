import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Instagram, ArrowRight, Loader2 } from "lucide-react";
import RuralNavbar from "@/components/rural/RuralNavbar";
import SiteFooter from "@/components/SiteFooter";
import SiteChrome from "@/components/SiteChrome";
import { applySeo } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

const Obrigado = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session");
  const [status, setStatus] = useState<"loading" | "ok" | "pending">("loading");
  const [purchase, setPurchase] = useState<{ amount?: number; email?: string } | null>(null);

  useEffect(() => {
    applySeo({
      title: "Compra confirmada | Sistema Melazzo",
      description: "Obrigado por escolher o Sistema Melazzo. Verifique seu e-mail para acessar a plataforma.",
      canonical: "https://melazzo.co/obrigado",
    });

    if (!sessionId) {
      setStatus("pending");
      return;
    }

    // Confirm with backend (also triggers webhook fallback)
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("verify-checkout", {
          body: { session_id: sessionId },
        });
        if (data?.paid) {
          setPurchase({ amount: data.amount, email: data.email });
          trackEvent("Purchase", {
            value: data.amount,
            currency: "BRL",
            transaction_id: sessionId,
          });
          setStatus("ok");
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("pending");
      }
    })();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <RuralNavbar variant="empresarial" />

      <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-navy min-h-[80vh] flex items-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 text-gold mx-auto mb-6 animate-spin" />
                <h1 className="font-display text-3xl font-bold text-primary-foreground mb-3">
                  Confirmando seu pagamento…
                </h1>
              </>
            )}

            {status !== "loading" && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/15 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-gold" />
                </div>
                <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">
                  {status === "ok" ? "Pagamento confirmado" : "Pedido recebido"}
                </p>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                  Bem-vindo ao{" "}
                  <span className="italic text-gradient-gold">Sistema Melazzo</span>
                </h1>
                <p className="font-body text-base text-primary-foreground/65 leading-relaxed max-w-lg mx-auto mb-10 font-light">
                  {status === "ok" && purchase?.email
                    ? <>Enviamos um e-mail para <strong className="text-primary-foreground">{purchase.email}</strong> com o link para você criar sua senha e acessar a plataforma agora mesmo.</>
                    : "Estamos confirmando seu pagamento. Em até 5 minutos você receberá um e-mail com o link de acesso à plataforma."
                  }
                </p>

                <div className="border border-gold/25 bg-primary-foreground/[0.03] p-6 mb-8 text-left">
                  <div className="flex items-start gap-3 mb-4">
                    <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-sm font-semibold text-primary-foreground mb-1">
                        Próximos passos
                      </p>
                      <p className="font-body text-xs text-primary-foreground/60 leading-relaxed font-light">
                        1. Verifique sua caixa de entrada (e a pasta de spam).<br />
                        2. Clique no link do e-mail para criar sua senha.<br />
                        3. Faça o onboarding inicial e libere o seu Health Score.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/viniciusmelazzo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("Lead", { content_name: "instagram_follow_thankyou" })}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-gold/40 text-gold font-body text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-gold/10 transition-colors mb-4"
                >
                  <Instagram className="w-4 h-4" />
                  Seguir @viniciusmelazzo
                </a>

                <div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-primary-foreground/55 font-body text-xs hover:text-gold transition-colors"
                  >
                    Voltar ao site <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <SiteFooter />
      <SiteChrome />
    </div>
  );
};

export default Obrigado;
