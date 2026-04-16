import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  LineChart,
  Wallet,
  PieChart,
  Target,
  ShieldCheck,
  CreditCard,
  Calendar,
  FileSpreadsheet,
  Lock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import RuralNavbar from "@/components/rural/RuralNavbar";
import PfContactSection from "@/components/PfContactSection";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import pfHero from "@/assets/pessoa-fisica-hero.jpg";
import pfHeroWebp from "@/assets/pessoa-fisica-hero.webp";
import pfHeroAvif from "@/assets/pessoa-fisica-hero.avif";

const pilares = [
  {
    icon: LineChart,
    title: "Visão Temporal",
    desc: "Acompanhe sua evolução em 3, 6, 12 meses ou YTD. Veja tendências, variações percentuais e o resultado líquido em gráficos interativos.",
  },
  {
    icon: PieChart,
    title: "Patrimônio Líquido",
    desc: "Cálculo automático do seu Net Worth: liquidez, investimentos e imobilizado menos passivos. Saiba exatamente o quanto você acumula.",
  },
  {
    icon: Target,
    title: "Orçamento Base Zero",
    desc: "Defina limites por categoria e acompanhe em tempo real. Barras de progresso te avisam antes que o gasto saia do plano.",
  },
  {
    icon: CreditCard,
    title: "Gestão de Cartões e Dívidas",
    desc: "Faturas, parcelamentos futuros e projeção do fim do endividamento. Cada parcela aparece no mês certo do seu fluxo de caixa.",
  },
  {
    icon: ShieldCheck,
    title: "Health Score Financeiro",
    desc: "Indicador 0–100 que mede liquidez, endividamento, poupança e disciplina orçamentária. Sua bússola de saúde financeira.",
  },
  {
    icon: Sparkles,
    title: "Acompanhamento Consultivo",
    desc: "Notas e planos de ação registrados pelo consultor. Você não usa a plataforma sozinho — usa com a Melazzo ao seu lado.",
  },
];

const funcionalidades = [
  {
    icon: Wallet,
    title: "Lançamentos Inteligentes",
    desc: "Registre receitas e despesas em segundos. Categorização automática alimenta DRE, orçamento e visão temporal simultaneamente.",
  },
  {
    icon: TrendingUp,
    title: "DRE Pessoal Mensal",
    desc: "Demonstrativo de resultado adaptado para a vida real. Custos fixos, variáveis, comprometimento de renda e taxa de poupança.",
  },
  {
    icon: Calendar,
    title: "Projeção de Fluxo de Caixa",
    desc: "Veja saldo previsto dos próximos 12 meses considerando parcelas ativas, vencimentos e renda recorrente.",
  },
  {
    icon: FileSpreadsheet,
    title: "Documentos & Histórico",
    desc: "Repositório seguro de comprovantes, contratos e relatórios. Tudo organizado, pesquisável e disponível 24/7.",
  },
];

const passos = [
  {
    num: "I",
    title: "Onboarding Guiado",
    desc: "Em 8 etapas estruturadas, mapeamos sua renda, custos, patrimônio, dívidas e objetivos. A teia de informações começa aqui.",
  },
  {
    num: "II",
    title: "Calibração com o Consultor",
    desc: "Reunião inicial para validar dados, alinhar metas e configurar seu orçamento base zero personalizado.",
  },
  {
    num: "III",
    title: "Uso Diário Simplificado",
    desc: "Lance receitas e despesas pelo celular ou desktop. A plataforma cuida dos cálculos, gráficos e alertas.",
  },
  {
    num: "IV",
    title: "Revisão Estratégica Mensal",
    desc: "Encontros recorrentes com o consultor para ler os indicadores, ajustar rotas e construir patrimônio com previsibilidade.",
  },
];

const PessoaFisicaHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <picture>
          <source type="image/avif" srcSet={pfHeroAvif} />
          <source type="image/webp" srcSet={pfHeroWebp} />
          <img
            src={pfHero}
            alt=""
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-navy opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy)/0.6)] to-transparent" />

      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-gold/25" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-gold/25" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-24 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
              Consultoria · Pessoa Física
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.05] mb-6 tracking-tight"
          >
            Sua vida financeira{" "}
            <span className="italic text-gradient-gold">organizada</span>, com
            inteligência consultiva.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="font-body text-lg text-primary-foreground/80 max-w-2xl leading-relaxed font-light mb-10"
          >
            Uma plataforma exclusiva, integrada à consultoria Melazzo, que transforma
            renda, despesas, patrimônio e dívidas em uma{" "}
            <span className="text-gold/90 font-medium">teia de informações</span>{" "}
            acionável — para você decidir com clareza e construir riqueza com método.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
            >
              Quero conhecer a plataforma
            </a>
            <a
              href="#pilares"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold/30 text-primary-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-gold hover:bg-gold/10"
            >
              Ver funcionalidades
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#pilares"
          className="flex flex-col items-center gap-2 text-primary-foreground/50 hover:text-gold transition-colors"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em]">
            Explore
          </span>
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

const PilaresSection = () => (
  <section id="pilares" className="py-24 lg:py-32 bg-linen">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-16"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-px bg-navy" />
          <span className="text-navy font-body text-xs tracking-[0.35em] uppercase font-semibold">
            Pilares da Plataforma
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight tracking-tight">
          Seis frentes que conversam entre si para revelar a{" "}
          <span className="italic text-gold">verdade</span> dos seus números.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pilares.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative bg-card border border-navy/10 p-8 hover:border-gold/40 hover:shadow-xl transition-all"
          >
            <div className="absolute top-0 left-0 w-12 h-px bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 flex items-center justify-center bg-navy/5 mb-6 group-hover:bg-gold/10 transition-colors">
              <p.icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors" />
            </div>
            <h3 className="font-display text-xl text-navy mb-3">{p.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FuncionalidadesSection = () => (
  <section className="py-24 lg:py-32 bg-navy text-primary-foreground">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-16"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-px bg-gold" />
          <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
            Ferramentas do dia a dia
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-primary-foreground leading-tight tracking-tight">
          Construída para uso{" "}
          <span className="italic text-gold">contínuo</span>, não para
          relatórios pontuais.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {funcionalidades.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-5 p-6 border border-gold/15 hover:border-gold/40 hover:bg-primary-foreground/5 transition-all"
          >
            <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gold/10">
              <f.icon className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg text-primary-foreground mb-2">
                {f.title}
              </h3>
              <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ComoFuncionaSection = () => (
  <section className="py-24 lg:py-32 bg-linen">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-16"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-px bg-navy" />
          <span className="text-navy font-body text-xs tracking-[0.35em] uppercase font-semibold">
            Como Funciona
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight tracking-tight">
          Quatro etapas, um único{" "}
          <span className="italic text-gold">propósito</span>: clareza
          financeira sustentável.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {passos.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative bg-card p-8 border-t-2 border-gold"
          >
            <span className="font-display text-5xl text-gold/30 leading-none mb-4 block">
              {p.num}
            </span>
            <h3 className="font-display text-xl text-navy mb-3">{p.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SegurancaSection = () => (
  <section className="py-20 bg-navy/95 text-primary-foreground border-t border-gold/10">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="w-10 h-px bg-gold" />
            <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
              Privacidade & Acesso
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground leading-tight tracking-tight mb-6">
            Plataforma de acesso{" "}
            <span className="italic text-gold">restrito por convite</span>.
          </h2>
          <p className="font-body text-base text-primary-foreground/75 leading-relaxed mb-4">
            Não há cadastro público. O acesso à área do cliente é liberado
            exclusivamente por convite da Melazzo Consultoria, garantindo a
            privacidade dos seus dados financeiros e a curadoria do
            atendimento.
          </p>
          <p className="font-body text-base text-primary-foreground/75 leading-relaxed">
            Infraestrutura com criptografia de ponta a ponta, conformidade com
            a LGPD e isolamento por usuário a nível de banco de dados.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {[
            { icon: Lock, label: "Criptografia em trânsito e em repouso" },
            { icon: ShieldCheck, label: "Conformidade LGPD e auditoria de acesso" },
            { icon: CheckCircle2, label: "Isolamento de dados por cliente (RLS)" },
            { icon: Sparkles, label: "Suporte humano consultivo, não autoatendimento" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-4 p-5 border border-gold/15 bg-primary-foreground/5"
            >
              <item.icon className="w-5 h-5 text-gold shrink-0" />
              <span className="font-body text-sm text-primary-foreground/85">
                {item.label}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  </section>
);

const CTAFinalSection = () => (
  <section className="py-24 bg-linen">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="w-10 h-px bg-gold" />
          <span className="text-navy font-body text-xs tracking-[0.35em] uppercase font-semibold">
            Próximo Passo
          </span>
          <div className="w-10 h-px bg-gold" />
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-navy leading-tight tracking-tight mb-6">
          Pronto para enxergar sua vida financeira com a{" "}
          <span className="italic text-gold">profundidade</span> que ela merece?
        </h2>
        <p className="font-body text-lg text-muted-foreground leading-relaxed mb-10">
          Agende uma conversa inicial gratuita. Vamos entender seu contexto e,
          se houver fit, abrir seu acesso à plataforma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contato"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
          >
            Agendar conversa inicial
          </a>
          <Link
            to="/cliente/login"
            className="inline-flex items-center justify-center px-8 py-4 border border-navy/30 text-navy font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-navy hover:bg-navy/5"
          >
            Já sou cliente · Entrar
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const PessoaFisica = () => {
  useEffect(() => {
    const prev = document.title;
    document.title =
      "Melazzo Consultoria · Pessoa Física | Plataforma de Gestão Financeira";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#inicio" className="skip-to-content">
        Pular para o conteúdo
      </a>
      <RuralNavbar variant="empresarial" />
      <PessoaFisicaHero />
      <PilaresSection />
      <FuncionalidadesSection />
      <ComoFuncionaSection />
      <SegurancaSection />
      <CTAFinalSection />
      <PfContactSection />
      <SiteFooter />
      <SiteChrome />
    </div>
  );
};

export default PessoaFisica;
