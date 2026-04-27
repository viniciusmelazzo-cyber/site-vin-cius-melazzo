import { Compass, Layers, TrendingUp } from "lucide-react";

const pilares = [
  {
    icon: Compass,
    titulo: "Diagnóstico",
    descricao: "Mapeamento completo da realidade financeira: dados, processos, riscos e oportunidades.",
  },
  {
    icon: Layers,
    titulo: "Estruturação",
    descricao: "Construção de painéis, controles e indicadores que traduzem complexidade em decisão.",
  },
  {
    icon: TrendingUp,
    titulo: "Crescimento",
    descricao: "Acompanhamento contínuo com insights e recomendações para destravar valor da operação.",
  },
];

export function MethodologyStrip() {
  return (
    <section className="py-20 md:py-28 px-6 bg-linen-warm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Metodologia Melazzo</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">
            Três pilares para um único objetivo: <em className="text-gradient-gold not-italic">clareza financeira</em>
          </h2>
          <div className="ornament-line mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilares.map((p, i) => (
            <div
              key={p.titulo}
              className="melazzo-card p-7 text-center animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded bg-navy text-gold mb-4 shadow-lg">
                <p.icon className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-xl font-semibold text-navy mb-2">{p.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
