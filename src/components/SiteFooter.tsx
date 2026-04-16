import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";

const navColumns = [
  {
    title: "Navegação",
    links: [
      { label: "Início", href: "/#inicio" },
      { label: "Quem Somos", href: "/#sobre" },
      { label: "Metodologia", href: "/#metodologia" },
      { label: "Contato", href: "/#contato" },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Consultoria Empresarial", href: "/empresarial" },
      { label: "Consultoria Rural", href: "/rural" },
      { label: "Pessoa Física", href: "/pessoa-fisica" },
      { label: "Manual de Crédito Rural", href: "/manual-credito-rural" },
    ],
  },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-gold/15">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Brand + Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Logo variant="onDark" size={56} />
              <div>
                <p className="font-display text-lg font-semibold tracking-wide">
                  Melazzo Consultoria
                </p>
                <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold">
                  Estratégia & Performance
                </p>
              </div>
            </div>

            <p className="font-body text-sm text-primary-foreground/65 leading-relaxed font-light max-w-md">
              Transformamos dados complexos em decisões claras e resultados financeiros
              sólidos para empresários e produtores rurais.
            </p>

            <ul className="space-y-3 text-sm font-body font-light">
              <li className="flex items-start gap-3 text-primary-foreground/75">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Uberaba & Uberlândia — Minas Gerais</span>
              </li>
              <li>
                <a
                  href="https://wa.me/5534992282778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/75 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>(34) 9 9228-2778</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@melazzo.co"
                  className="flex items-start gap-3 text-primary-foreground/75 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>contato@melazzo.co</span>
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="pt-2">
              <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">
                Acompanhe
              </p>
              <ul className="flex items-center gap-3">
                {SOCIAL_CHANNELS.map((channel) => (
                  <li key={channel.name}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${channel.name} de Vinícius Melazzo`}
                      className="flex items-center justify-center w-10 h-10 border border-gold/25 text-primary-foreground/70 hover:text-primary hover:border-transparent transition-all duration-300"
                      style={{ ['--brand' as string]: channel.color }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = channel.color;
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.color = "";
                      }}
                    >
                      <channel.Icon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="font-body text-sm text-primary-foreground/65 hover:text-gold transition-colors font-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA column */}
          <div className="lg:col-span-3">
            <p className="text-gold font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">
              Próximo passo
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-gold/25 p-6 bg-primary-foreground/[0.03]"
            >
              <h3 className="font-display text-lg font-semibold leading-snug mb-3">
                Agende sua análise estratégica
              </h3>
              <p className="font-body text-xs text-primary-foreground/55 leading-relaxed font-light mb-5">
                Conversa de 30 minutos, sem custo, para mapear seus próximos passos.
              </p>
              <Link
                to="/#contato"
                className="inline-flex items-center gap-2 text-gold font-body text-[11px] tracking-[0.2em] uppercase font-semibold hover:gap-3 transition-all"
              >
                Falar com Vinícius
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <Link
              to="/cliente/login"
              className="block mt-4 text-center px-4 py-3 border border-primary-foreground/15 text-primary-foreground/70 font-body text-[11px] tracking-[0.2em] uppercase font-medium hover:border-gold/40 hover:text-gold transition-all"
            >
              Área do Cliente
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/40 font-light">
            © {year} Melazzo Consultoria. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs font-body text-primary-foreground/40 font-light">
            <Link to="/privacidade" className="hover:text-gold transition-colors">
              Política de Privacidade
            </Link>
            <span aria-hidden="true">·</span>
            <span>CNPJ disponível mediante solicitação</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
