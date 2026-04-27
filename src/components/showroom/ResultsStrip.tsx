import { CountUp } from "@/components/ui/count-up";

const numeros = [
  { end: 200, prefix: "+", suffix: "", label: "Empresas atendidas" },
  { end: 2, prefix: "R$ ", suffix: " bi", label: "Sob análise consolidada" },
  { end: 15, prefix: "", suffix: " anos", label: "De experiência financeira" },
  { end: 98, prefix: "", suffix: "%", label: "Retenção de clientes" },
];

export function ResultsStrip() {
  return (
    <section className="py-20 md:py-24 px-6 bg-gradient-navy text-linen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--gold)/0.08),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Resultados que falam</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Confiados por quem decide.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {numeros.map((n) => (
            <div key={n.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-gold tabular leading-none">
                <CountUp end={n.end} prefix={n.prefix} suffix={n.suffix} duration={2200} />
              </p>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-linen/70 mt-3">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
