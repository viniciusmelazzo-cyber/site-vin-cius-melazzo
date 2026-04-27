import { Building2, Tractor, Scale } from "lucide-react";
import { HeroShowroom } from "@/components/showroom/HeroShowroom";
import { ProductCard } from "@/components/showroom/ProductCard";
import { MethodologyStrip } from "@/components/showroom/MethodologyStrip";
import { ResultsStrip } from "@/components/showroom/ResultsStrip";
import { ShowroomFooter } from "@/components/showroom/ShowroomFooter";
import empresarialImg from "@/assets/empresarial-hero.webp";
import agroImg from "@/assets/agro-hero.webp";
import cobrancaImg from "@/assets/cobranca-hero.webp";

const produtos = [
  {
    to: "/restrito/demonstracoes/empresarial/panorama",
    available: true,
    icon: Building2,
    name: "Gestão Financeira Empresarial",
    tagline:
      "Para empresas que querem enxergar o resultado real, não só o que cabe na planilha.",
    features: [
      "Faturamento, fluxo de caixa e DRE consolidados",
      "Endividamento, custos fixos e variáveis sob controle",
      "Pipeline comercial, estoque e patrimônio integrados",
      "Score de saúde financeira + Inteligência Melazzo",
    ],
    metrics: "11 módulos · Dashboards executivos · Insights IA",
    image: empresarialImg,
    accent: "gold" as const,
    badge: "Demo Ativa",
  },
  {
    to: "/restrito/demonstracoes/agro/visao-executiva",
    available: true,
    icon: Tractor,
    name: "Gestão Agro & Pecuária",
    tagline:
      "Visão financeira completa para produtores rurais, com lastro patrimonial e capacidade de pagamento.",
    features: [
      "Lastro patrimonial: terras, máquinas e rebanho",
      "Custeio de safra e indicadores de pecuária",
      "Cotações de mercado e risco de crédito",
      "Dossiê executivo pronto para o banco",
    ],
    metrics: "10 módulos · Análise por safra · Dossiê PDF",
    image: agroImg,
    accent: "agro" as const,
    badge: "Demo Ativa",
  },
  {
    to: "/restrito/demonstracoes/cobranca/visao-geral",
    available: true,
    icon: Scale,
    name: "Gestão de Inadimplência",
    tagline:
      "Carteira ativa sob controle: da pré-cobrança ao acordo, com PDD e produtividade visíveis.",
    features: [
      "Aging report e PDD consolidada",
      "Régua de cobrança e Kanban de acordos",
      "Simulador de acordo com valor presente",
      "Visão jurídica e produtividade da equipe",
    ],
    metrics: "10 módulos · Recuperação acelerada · Alertas IA",
    image: cobrancaImg,
    accent: "warning" as const,
    badge: "Demo Ativa",
  },
];

export default function Showroom() {
  return (
    <div className="min-h-screen bg-background">
      <HeroShowroom />

      {/* Produtos */}
      <section id="produtos" className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Nossos Produtos</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-navy leading-tight">
              Escolha a demonstração ideal para você
            </h2>
            <div className="ornament-line mx-auto mt-4" />
            <p className="text-sm text-muted-foreground mt-5 max-w-2xl mx-auto leading-relaxed">
              Cada produto é uma plataforma viva, populada com dados anônimos de uma operação real
              típica do segmento. Navegue à vontade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((p, i) => (
              <ProductCard key={p.name} {...p} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      <MethodologyStrip />
      <ResultsStrip />
      <ShowroomFooter />
    </div>
  );
}
