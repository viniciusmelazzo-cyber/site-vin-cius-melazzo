import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  CheckCircle2, Loader2, AlertCircle, BookOpen, Shield, Landmark,
  FileText, Leaf, Lightbulb, ChevronRight, ArrowDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import manualCover from "@/assets/manual-cover.png";
import logoVM from "@/assets/logo-vm.webp";

const SEGMENTOS = ["Agro", "Indústria", "Serviços", "Outro"] as const;

const BENEFICIOS = [
  { icon: BookOpen, text: "Desmistifica termos e processos do crédito rural" },
  { icon: Landmark, text: "Explica modalidades: custeio, investimento, comercialização e industrialização" },
  { icon: FileText, text: "Programas detalhados: PRONAF, PRONAMP e setoriais" },
  { icon: Shield, text: "Garantias, seguros, Proagro e cuidados jurídicos" },
  { icon: Leaf, text: "Exigências ambientais (CAR) e rotas de conformidade" },
  { icon: Lightbulb, text: "Ferramentas práticas e estudos de caso reais" },
];

const MODULOS = [
  "Panorama do Crédito Rural no Brasil",
  "Fontes de Recursos e Agentes Financeiros",
  "Modalidades de Financiamento",
  "PRONAF: Agricultura Familiar",
  "PRONAMP e Programas Setoriais",
  "Garantias e Colaterais",
  "Seguros Rurais e Proagro",
  "Cadastro Ambiental Rural (CAR)",
  "Aspectos Jurídicos e Contratuais",
  "Planejamento Financeiro da Propriedade",
  "Estudos de Caso e Aplicações Práticas",
  "Checklist de Documentação Completa",
];

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  propriedade: string;
  segmento: string;
  wants_checklist: boolean;
  lgpd: boolean;
  honeypot: string;
}

const initialForm: FormData = {
  nome: "", email: "", telefone: "", propriedade: "", segmento: "",
  wants_checklist: false, lgpd: false, honeypot: "",
};

const ManualCreditoRural = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Manual de Crédito Rural 2026 | Melazzo Consultoria";
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("name", "description", "Baixe grátis o Manual Completo de Crédito Rural 2026. Guia estratégico para produtores rurais sobre financiamento, PRONAF, PRONAMP e agronegócio.");
    setMeta("property", "og:title", "Manual de Crédito Rural 2026 | Melazzo Consultoria");
    setMeta("property", "og:description", "Guia estratégico gratuito para produtores rurais. Domine o crédito rural com a Teia de Informações.");
    setMeta("property", "og:type", "website");
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lgpd) {
      setErrorMsg("Você precisa aceitar a Política de Privacidade.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const params = new URLSearchParams(window.location.search);
    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      propriedade: form.propriedade || null,
      segmento: form.segmento || null,
      wants_checklist: form.wants_checklist,
      honeypot: form.honeypot,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
      page_path: window.location.pathname,
    };

    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", { body: payload });
      if (error) throw error;
      if (data && !data.sucesso) {
        setErrorMsg(data.mensagem || "Erro ao enviar.");
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
    <>

      <div className="min-h-screen bg-background">
        {/* Navbar mini */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img src={logoVM} alt="Melazzo Consultoria" className="w-8 h-8 object-contain" />
              <span className="font-display text-sm text-primary-foreground font-semibold tracking-wide hidden sm:block">
                Melazzo Consultoria
              </span>
            </a>
            <button
              onClick={scrollToForm}
              className="px-6 py-2 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            >
              Baixar Manual
            </button>
          </div>
        </nav>

        {/* ===== HERO ===== */}
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-navy relative overflow-hidden">
          <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-gold/10" />
          <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-gold/10" />

          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block font-body text-xs tracking-[0.25em] uppercase text-gold mb-6">
                  E-book gratuito • Edição 2026
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-primary-foreground leading-[1.1] mb-6">
                  Desvende o Crédito Rural:{" "}
                  <span className="italic text-gold">baixe grátis o Manual Completo 2026</span>
                </h1>
                <p className="font-body text-base lg:text-lg text-primary-foreground/60 leading-relaxed mb-8 max-w-lg font-light">
                  Aprenda a navegar no sistema, otimizar seu acesso e proteger seu patrimônio
                  com a <strong className="text-primary-foreground/80">Teia de Informações</strong>.
                </p>
                <button
                  onClick={scrollToForm}
                  className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-all hover:shadow-xl hover:shadow-accent/20"
                >
                  Quero receber no e-mail
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gold/5 blur-3xl rounded-full" />
                  <img
                    src={manualCover}
                    alt="Manual Completo de Crédito Rural 2026 — Melazzo Consultoria"
                    className="relative w-64 md:w-80 lg:w-[22rem] drop-shadow-2xl"
                    width={600}
                    height={800}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== BENEFÍCIOS ===== */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que baixar este manual?
              </h2>
              <p className="font-body text-muted-foreground font-light max-w-xl mx-auto">
                Um guia completo para quem quer dominar o crédito rural e tomar decisões estratégicas.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {BENEFICIOS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-6 bg-card border border-border/60 hover:border-accent/30 transition-colors"
                >
                  <b.icon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-foreground/80 leading-relaxed">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== O QUE TEM DENTRO ===== */}
        <section className="py-20 lg:py-28 bg-card border-y border-border/40">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  O que tem dentro do manual
                </h2>
                <p className="font-body text-muted-foreground font-light mb-2">
                  12 módulos cobrindo tudo que você precisa saber sobre crédito rural.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                {MODULOS.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className="font-body text-xs text-accent font-semibold w-6 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ChevronRight className="w-3 h-3 text-accent/50 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground/80">{m}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== AUTORIDADE ===== */}
        <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block font-body text-xs tracking-[0.25em] uppercase text-gold mb-6">
                Sobre o autor
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Vinícius Melazzo
              </h2>
              <p className="font-body text-base text-primary-foreground/60 leading-relaxed mb-8 font-light">
                Especialista em estratégia financeira e crédito rural, idealizador da metodologia{" "}
                <strong className="text-gold">Teia de Informações</strong> — uma abordagem que conecta
                dados, mercado e estratégia para entregar o{" "}
                <em>crédito certo, no momento certo, para o cliente certo, com a narrativa correta</em>.
              </p>
              <div className="flex items-center justify-center gap-6 text-primary-foreground/40 text-xs font-body tracking-wider uppercase">
                <span>Melazzo Consultoria</span>
                <span className="w-1 h-1 bg-gold rounded-full" />
                <span>Estratégia & Performance</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FORMULÁRIO ===== */}
        <section id="formulario" className="py-20 lg:py-28 bg-gradient-navy relative overflow-hidden">
          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            <div className="max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Receba o manual <span className="italic">gratuitamente</span>
                </h2>
                <p className="font-body text-sm text-primary-foreground/50 font-light">
                  Preencha seus dados e enviaremos o link de download para o seu e-mail.
                </p>
              </motion.div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-primary-foreground font-semibold mb-3">
                    Pronto!
                  </h3>
                  <p className="font-body text-primary-foreground/60 text-sm leading-relaxed max-w-sm mx-auto">
                    Enviamos o link para o seu e-mail.
                    <br />
                    <span className="text-primary-foreground/40">Verifique também a pasta de spam.</span>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-5"
                >
                  {/* Honeypot */}
                  <input
                    type="text" name="honeypot" value={form.honeypot}
                    onChange={handleChange} className="absolute -left-[9999px]"
                    tabIndex={-1} autoComplete="off" aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="lp-nome" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                      Nome *
                    </label>
                    <input
                      id="lp-nome" name="nome" type="text" required minLength={3}
                      value={form.nome} onChange={handleChange}
                      className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="lp-email" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                        E-mail *
                      </label>
                      <input
                        id="lp-email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="lp-telefone" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                        Telefone *
                      </label>
                      <input
                        id="lp-telefone" name="telefone" type="tel" required
                        value={form.telefone} onChange={handleChange}
                        className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                        placeholder="(34) 9 9228-2778"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="lp-propriedade" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                        Propriedade / Empresa
                      </label>
                      <input
                        id="lp-propriedade" name="propriedade" type="text"
                        value={form.propriedade} onChange={handleChange}
                        className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-primary-foreground/25"
                        placeholder="Nome da propriedade"
                      />
                    </div>
                    <div>
                      <label htmlFor="lp-segmento" className="block font-body text-xs text-primary-foreground/50 uppercase tracking-wider mb-2">
                        Segmento
                      </label>
                      <select
                        id="lp-segmento" name="segmento" value={form.segmento} onChange={handleChange}
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
                      type="checkbox" name="wants_checklist"
                      checked={form.wants_checklist} onChange={handleChange}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="font-body text-sm text-primary-foreground/60 group-hover:text-primary-foreground/80 transition-colors">
                      Quero receber também o checklist de documentação
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox" name="lgpd"
                      checked={form.lgpd} onChange={handleChange}
                      className="w-4 h-4 accent-gold mt-0.5"
                    />
                    <span className="font-body text-xs text-primary-foreground/40 group-hover:text-primary-foreground/60 transition-colors leading-relaxed">
                      Li e concordo com a{" "}
                      <a href="/privacidade" className="underline text-gold/70 hover:text-gold">
                        Política de Privacidade
                      </a>
                      . Seus dados estão seguros e não serão compartilhados.
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
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
                    ) : (
                      "Receber Manual Gratuito"
                    )}
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary py-8">
          <div className="container mx-auto px-6 text-center">
            <p className="font-body text-xs text-primary-foreground/30">
              © 2026 Melazzo Consultoria — Estratégia & Performance Empresarial
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ManualCreditoRural;
