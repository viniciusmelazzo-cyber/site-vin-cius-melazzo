import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Users, Briefcase, MapPin } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface MetricProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isVisible: boolean;
  delay: number;
}

const Metric = ({ icon: Icon, value, suffix, prefix, label, isVisible, delay }: MetricProps) => {
  const count = useCountUp(value, 2200, isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center group"
    >
      <div className="w-14 h-14 flex items-center justify-center border border-gold/30 mb-5 group-hover:border-gold transition-colors">
        <Icon className="w-6 h-6 text-gold" />
      </div>
      <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
        {prefix}
        {count}
        {suffix}
      </div>
      <p className="font-body text-sm text-graphite/70 max-w-[220px] font-light">{label}</p>
    </motion.div>
  );
};

const RuralProof = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, amount: 0.3 });

  const metrics = [
    { icon: TrendingUp, value: 200, prefix: "R$ ", suffix: " Mi+", label: "Intermediados em operações de crédito" },
    { icon: Users, value: 70, suffix: "+", label: "Provedores parceiros em todo o Brasil" },
    { icon: Briefcase, value: 30, suffix: "+", label: "Soluções financeiras customizadas" },
    { icon: MapPin, value: 10, suffix: "+", label: "Anos de experiência no mercado" },
  ];

  return (
    <section id="prova" className="py-20 bg-linen-texture-dark relative" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {metrics.map((m, i) => (
            <Metric key={m.label} {...m} isVisible={isVisible} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RuralProof;
