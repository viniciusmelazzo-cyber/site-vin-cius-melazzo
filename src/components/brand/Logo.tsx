import { cn } from "@/lib/utils";

type LogoVariant = "auto" | "navy" | "light" | "gold";

interface LogoProps {
  /**
   * navy  → uso sobre fundos claros (linen, branco, cards)
   * light → uso sobre fundos escuros (navy, hero, footer)
   * gold  → versão monocromática dourada para acentos
   * auto  → herda currentColor (usa text-* do parent)
   */
  variant?: LogoVariant;
  /** Mostra textura grunge sutil sobre o monograma */
  textured?: boolean;
  /** Mostra a wordmark "MELAZZO CONSULTORIA" abaixo do monograma */
  withWordmark?: boolean;
  /** Tamanho em px do monograma (largura). Default: 40 */
  size?: number;
  className?: string;
  title?: string;
}

const PALETTE: Record<Exclude<LogoVariant, "auto">, { mark: string; accent: string; text: string }> = {
  navy:  { mark: "hsl(var(--navy))",             accent: "hsl(var(--gold))", text: "hsl(var(--navy))" },
  light: { mark: "hsl(var(--primary-foreground))", accent: "hsl(var(--gold))", text: "hsl(var(--primary-foreground))" },
  gold:  { mark: "hsl(var(--gold))",             accent: "hsl(var(--gold))", text: "hsl(var(--gold))" },
};

/**
 * Monograma V+M vetorial.
 * - O M é construído a partir de duas pernas verticais e um vale central em V.
 * - O V é formado pelo vale interno do M, destacado em accent (gold).
 * Resultado: o V vive dentro do M (Vinícius dentro de Melazzo).
 */
const Logo = ({
  variant = "auto",
  textured = false,
  withWordmark = false,
  size = 40,
  className,
  title = "Melazzo Consultoria",
}: LogoProps) => {
  const useCurrent = variant === "auto";
  const colors = useCurrent ? null : PALETTE[variant];
  const markColor = useCurrent ? "currentColor" : colors!.mark;
  const accentColor = useCurrent ? "currentColor" : colors!.accent;
  const textColor = useCurrent ? "currentColor" : colors!.text;

  const height = withWordmark ? size * 1.35 : size;
  // textura única por instância para evitar colisão de IDs
  const uid = `vm-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <span
      className={cn("inline-flex flex-col items-center leading-none select-none", className)}
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="block"
      >
        <defs>
          {/* Textura grunge sutil */}
          <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <mask id={`${uid}-mask`}>
            <rect width="100" height="100" fill="white" />
          </mask>
        </defs>

        {/* M — duas pernas verticais robustas + topos angulares */}
        <g mask={`url(#${uid}-mask)`}>
          {/* Perna esquerda */}
          <path
            d="M 14 12 L 30 12 L 30 88 L 14 88 Z"
            fill={markColor}
          />
          {/* Perna direita */}
          <path
            d="M 70 12 L 86 12 L 86 88 L 70 88 Z"
            fill={markColor}
          />
          {/* Topo esquerdo (diagonal descendo até o vale) */}
          <path
            d="M 14 12 L 30 12 L 50 60 L 50 78 Z"
            fill={markColor}
          />
          {/* Topo direito (diagonal descendo até o vale) */}
          <path
            d="M 70 12 L 86 12 L 50 78 L 50 60 Z"
            fill={markColor}
          />

          {/* V interno — destaque em accent (gold) */}
          <path
            d="M 32 12 L 50 60 L 68 12 L 62 12 L 50 44 L 38 12 Z"
            fill={accentColor}
            opacity="0.95"
          />

          {/* Pingo de tinta dourado (canto superior do vale) */}
          <circle cx="50" cy="8" r="1.6" fill={accentColor} />
          <circle cx="46" cy="4.5" r="0.8" fill={accentColor} opacity="0.6" />

          {/* Detalhe ponto inferior direito */}
          <circle cx="78" cy="78" r="1.4" fill={accentColor} opacity="0.7" />

          {textured && (
            <rect
              width="100"
              height="100"
              fill={markColor}
              filter={`url(#${uid}-grain)`}
              opacity="0.35"
            />
          )}
        </g>

        <title>{title}</title>
      </svg>

      {withWordmark && (
        <span
          className="mt-1.5 font-body font-semibold uppercase"
          style={{
            color: textColor,
            fontSize: size * 0.18,
            letterSpacing: size * 0.018,
          }}
        >
          Melazzo
          <span style={{ color: accentColor }}> · </span>
          <span style={{ opacity: 0.75 }}>Consultoria</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
