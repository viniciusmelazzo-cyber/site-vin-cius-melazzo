import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoVM from "@/assets/logo-vm.webp";

const SEGMENTOS = ["Agro", "Indústria", "Serviços", "Outro"] as const;

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  propriedade: string;
  segmento: string;
  wants_checklist: boolean;
  honeypot: string;
}

const initialForm: FormData = {
  nome: "",
  email: "",
  telefone: "",
  propriedade: "",
  segmento: "",
  wants_checklist: false,
  honeypot: "",
};

const ContactSection = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Collect UTM params from URL
    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...form,
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
      utm_content: params.get("utm_content") || null,
      utm_term: params.get("utm_term") || null,
      page_path: window.location.pathname,
    };

    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: payload,
      });

      if (error) throw error;
      if (data && !data.sucesso) {
        setErrorMsg(data.mensagem || "Erro ao enviar. Tente novamente.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  };

  return (
    <section id="contato" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          <motion.img
            src={logoVM}
            alt="Melazzo Consultoria"
            className="w-16 h-16 object-contain mx-auto mb-8 opacity-50"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 tracking-tight text-center"
          >
            Receba o <span className="italic">Manual de Crédito Rural 2026</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-base text-primary-foreground/60 leading-relaxed mb-10 font-light text-center"
          >
            Preencha abaixo e receba gratuitamente no seu e-mail.
          </motion.p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl text-primary-foreground font-semibold mb-2">
                Pronto!
              </h3>
              <p className="font-body text-primary-foreground/60 text-sm">
                Verifique seu e-mail para baixar o manual. O link expira em 24h.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              {/* Honeypot - hidden */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                className="absolute -left-[9999px]"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div>
                <label htmlFor="nome" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                  Nome *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  minLength={3}
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                    placeholder="(34) 9 9228-2778"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="propriedade" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                    Propriedade / Empresa
                  </label>
                  <input
                    id="propriedade"
                    name="propriedade"
                    type="text"
                    value={form.propriedade}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                    placeholder="Nome da propriedade"
                  />
                </div>
                <div>
                  <label htmlFor="segmento" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                    Segmento
                  </label>
                  <select
                    id="segmento"
                    name="segmento"
                    value={form.segmento}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    {SEGMENTOS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="wants_checklist"
                  checked={form.wants_checklist}
                  onChange={handleChange}
                  className="w-4 h-4 accent-gold"
                />
                <span className="font-body text-sm text-primary-foreground/60 group-hover:text-primary-foreground/80 transition-colors">
                  Quero receber também o checklist de documentação
                </span>
              </label>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 font-body text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 px-12 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Receber Manual Gratuito"
                )}
              </button>
            </motion.form>
          )}

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
          >
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">Uberaba & Uberlândia — MG</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <a
              href="https://wa.me/5534992282778"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">(34) 9 9228-2778</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 lg:px-12 mt-24">
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body text-xs text-primary-foreground/35 font-light">
            © 2025 Melazzo Consultoria
          </span>
          <span className="font-body text-xs text-primary-foreground/35 font-light">
            Estratégia & Performance Empresarial
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
