import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Loader2, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/brand/Logo";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  honeypot: string;
}

const initialForm: FormData = {
  nome: "",
  email: "",
  telefone: "",
  mensagem: "",
  honeypot: "",
};

const PfContactSection = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...form,
      origem: "reuniao-pf",
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
    <section
      id="contato"
      className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden"
    >
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-8 flex justify-center"
          >
            <Logo variant="light" size={64} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
              Agende sua conversa
            </span>
            <div className="w-10 h-px bg-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 tracking-tight text-center leading-tight"
          >
            Vamos conversar sobre sua{" "}
            <span className="italic text-gradient-gold">vida financeira</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-base text-primary-foreground/65 leading-relaxed mb-10 font-light text-center"
          >
            Deixe seus dados e nossa equipe entrará em contato em até{" "}
            <span className="text-gold/90">24 horas úteis</span> para entender
            seu contexto e marcar uma reunião inicial sem custo.
          </motion.p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 border border-gold/20 bg-primary-foreground/5"
            >
              <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl text-primary-foreground font-semibold mb-2">
                Recebemos seu contato!
              </h3>
              <p className="font-body text-primary-foreground/65 text-sm max-w-sm mx-auto">
                Em breve a Melazzo Consultoria entrará em contato para agendar
                sua reunião inicial.
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
              {/* Honeypot */}
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
                <label
                  htmlFor="pf-nome"
                  className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2"
                >
                  Nome *
                </label>
                <input
                  id="pf-nome"
                  name="nome"
                  type="text"
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="pf-email"
                    className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2"
                  >
                    E-mail *
                  </label>
                  <input
                    id="pf-email"
                    name="email"
                    type="email"
                    required
                    maxLength={180}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-telefone"
                    className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2"
                  >
                    WhatsApp *
                  </label>
                  <input
                    id="pf-telefone"
                    name="telefone"
                    type="tel"
                    required
                    maxLength={20}
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                    placeholder="(34) 9 9228-2778"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pf-mensagem"
                  className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2"
                >
                  Conte rapidamente seu contexto (opcional)
                </label>
                <textarea
                  id="pf-mensagem"
                  name="mensagem"
                  rows={4}
                  maxLength={2000}
                  value={form.mensagem}
                  onChange={handleChange}
                  className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25 resize-none"
                  placeholder="Ex: quero organizar finanças pessoais, planejar aposentadoria, sair de dívidas, etc."
                />
              </div>

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
                  <>
                    <Calendar className="w-4 h-4" />
                    Quero agendar minha conversa
                  </>
                )}
              </button>

              <p className="text-center font-body text-xs text-primary-foreground/40 leading-relaxed">
                Ao enviar você concorda em receber contato da Melazzo Consultoria.
                Seus dados são tratados conforme a LGPD.
              </p>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
          >
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">
                Uberaba & Uberlândia — MG
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <a
              href="https://wa.me/5534992282778"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">
                (34) 9 9228-2778
              </span>
            </a>
          </motion.div>
        </div>

        <div className="mt-24 border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body text-xs text-primary-foreground/35 font-light">
            © 2025 Melazzo Consultoria
          </span>
          <span className="font-body text-xs text-primary-foreground/35 font-light">
            Estratégia & Performance · Pessoa Física
          </span>
        </div>
      </div>
    </section>
  );
};

export default PfContactSection;
