import { cn } from "@/lib/utils";
import logoVM from "@/assets/logo-vm.webp";
import logoVM2x from "@/assets/logo-vm@2x.webp";

type LogoVariant = "auto" | "onDark" | "onLight" | "light" | "navy" | "gold";

interface LogoProps {
  /**
   * onDark  → uso sobre fundos escuros (navy, hero) — adiciona leve halo dourado p/ destacar
   * onLight → uso sobre fundos claros (linen, branco) — sem ajustes
   * auto    → renderiza neutro (sem efeitos)
   */
  variant?: LogoVariant;
  /** Tamanho em px (largura/altura). Default: 40 */
  size?: number;
  className?: string;
  alt?: string;
  /** Renderiza wordmark "Melazzo Consultoria" ao lado */
  withWordmark?: boolean;
  /** Cor do wordmark quando ativo */
  wordmarkClassName?: string;
}

/**
 * Componente Logo reutilizável.
 * Usa a imagem original `logo-vm.webp` com:
 *  - tamanhos responsivos via prop `size`
 *  - srcset 1x/2x para nitidez em retina
 *  - leve drop-shadow dourado em fundos escuros (legibilidade)
 *  - decoding async + lazy fora da fold
 */
const Logo = ({
  variant = "auto",
  size = 40,
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

  const filterStyle =
    v === "onDark"
      ? {
          filter:
            "drop-shadow(0 0 1px hsl(var(--gold) / 0.35)) drop-shadow(0 1px 2px hsl(0 0% 0% / 0.45))",
        }
      : v === "onLight"
      ? { filter: "drop-shadow(0 1px 1px hsl(var(--navy) / 0.15))" }
      : undefined;

  return (
    <span
      className={cn("inline-flex items-center gap-3 leading-none select-none", className)}
    >
      <img
        src={logoVM}
        srcSet={`${logoVM} 1x, ${logoVM2x} 2x`}
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
