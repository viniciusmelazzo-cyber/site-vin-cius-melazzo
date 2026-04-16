import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-vm-mark.webp";
import logoMark2x from "@/assets/logo-vm-mark@2x.webp";
import logoMarkLight from "@/assets/logo-vm-mark-light.webp";

type LogoVariant = "auto" | "onDark" | "onLight" | "light" | "navy" | "gold";

interface LogoProps {
  /**
   * onDark  → uso sobre fundos escuros (navy, hero) — usa versão clarificada (M cream + V gold)
   * onLight → uso sobre fundos claros (linen, branco) — usa versão original
   * auto    → renderiza versão original (sem efeitos)
   */
  variant?: LogoVariant;
  /** Tamanho em px (largura/altura). Default: 48 */
  size?: number;
  className?: string;
  alt?: string;
  /** Renderiza wordmark "Melazzo Consultoria" ao lado */
  withWordmark?: boolean;
  /** Cor do wordmark quando ativo */
  wordmarkClassName?: string;
}

/**
 * Componente Logo reutilizável — monograma V+M oficial.
 * - Asset transparente extraído do poster original
 * - srcset 1x/2x para nitidez retina
 * - variante "onDark" troca para versão clarificada (legibilidade em navy)
 * - drop-shadow contextual sutil
 */
const Logo = ({
  variant = "auto",
  size = 48,
  className,
  alt = "Melazzo Consultoria",
  withWordmark = false,
  wordmarkClassName,
}: LogoProps) => {
  // aliases p/ retrocompatibilidade
  const v: "onDark" | "onLight" | "auto" =
    variant === "light" || variant === "onDark" ? "onDark"
    : variant === "navy" || variant === "gold" || variant === "onLight" ? "onLight"
    : "auto";

  // Em fundos escuros usamos a versão clarificada
  const src = v === "onDark" ? logoMarkLight : logoMark;
  const src2x = v === "onDark" ? logoMarkLight : logoMark2x;

  const filterStyle =
    v === "onDark"
      ? {
          filter:
            "drop-shadow(0 0 2px hsl(var(--gold) / 0.25)) drop-shadow(0 1px 3px hsl(0 0% 0% / 0.5))",
        }
      : v === "onLight"
      ? { filter: "drop-shadow(0 1px 2px hsl(var(--navy) / 0.18))" }
      : undefined;

  return (
    <span
      className={cn("inline-flex items-center gap-3 leading-none select-none", className)}
    >
      <img
        src={src}
        srcSet={`${src} 1x, ${src2x} 2x`}
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          imageRendering: "auto",
          ...filterStyle,
        }}
        className="block"
        draggable={false}
      />
      {withWordmark && (
        <span
          className={cn(
            "font-display font-semibold tracking-wide whitespace-nowrap",
            wordmarkClassName,
          )}
          style={{ fontSize: size * 0.42 }}
        >
          Melazzo Consultoria
        </span>
      )}
    </span>
  );
};

export default Logo;
