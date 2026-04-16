import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/analytics";

/**
 * LGPD-compliant cookie consent banner. Appears bottom-right on first
 * visit until the user accepts or declines. Persists choice in
 * localStorage and toggles Google Consent Mode v2 + pixel loading.
 */
const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === "unknown") {
      // Tiny delay so it doesn't fight with hero animation
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handle = (state: "granted" | "denied") => {
    setConsent(state);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-label="Aviso de cookies"
          className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-[60] max-w-md bg-primary border border-gold/25 shadow-2xl"
        >
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <Cookie className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-primary-foreground mb-1.5">
                  Sua privacidade
                </p>
                <p className="font-body text-xs text-primary-foreground/65 leading-relaxed">
                  Usamos cookies para entender como o site é usado e melhorar sua
                  experiência. Você pode aceitar ou recusar a qualquer momento. Veja a{" "}
                  <Link to="/privacidade" className="text-gold underline underline-offset-2 hover:text-gold/80">
                    Política de Privacidade
                  </Link>.
                </p>
              </div>
              <button
                onClick={() => handle("denied")}
                aria-label="Recusar cookies"
                className="text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handle("denied")}
                className="flex-1 px-3 py-2 border border-primary-foreground/20 text-primary-foreground/75 font-body text-[11px] tracking-[0.2em] uppercase font-medium hover:border-primary-foreground/40 hover:text-primary-foreground transition-all"
              >
                Recusar
              </button>
              <button
                onClick={() => handle("granted")}
                className="flex-1 px-3 py-2 bg-gradient-gold text-primary font-body text-[11px] tracking-[0.2em] uppercase font-semibold hover:opacity-90 transition-opacity"
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
