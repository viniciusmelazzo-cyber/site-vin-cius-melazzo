import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Original JPG/PNG fallback */
  src: string;
  /** AVIF version (preferred) */
  avif?: string;
  /** WebP version (fallback before original) */
  webp?: string;
  alt: string;
}

/**
 * Renders an <img> wrapped in <picture> with AVIF + WebP sources for
 * automatic format negotiation by the browser.
 */
export const ResponsiveImage = ({
  src,
  avif,
  webp,
  alt,
  className,
  ...rest
}: ResponsiveImageProps) => (
  <picture>
    {avif && <source type="image/avif" srcSet={avif} />}
    {webp && <source type="image/webp" srcSet={webp} />}
    <img src={src} alt={alt} className={className} {...rest} />
  </picture>
);

interface ResponsiveBgImageProps {
  src: string;
  avif?: string;
  webp?: string;
  alt?: string;
  className?: string;
  /** object-position value (e.g. 'center', 'top', '50% 30%'). Defaults to 'center'. */
  position?: string;
  /** loading attribute. Defaults to 'eager' since these are usually heroes. */
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Replaces CSS `background-image` patterns with a real <picture>/<img>
 * positioned absolutely so the browser can negotiate AVIF/WebP/JPG.
 *
 * Usage: drop into a `relative` container as the first child.
 *   <div className="relative">
 *     <ResponsiveBgImage src={img} avif={imgAvif} webp={imgWebp} />
 *     ... overlays ...
 *   </div>
 */
export const ResponsiveBgImage = ({
  src,
  avif,
  webp,
  alt = "",
  className,
  position = "center",
  loading = "eager",
  fetchPriority = "high",
}: ResponsiveBgImageProps) => (
  <picture className={cn("absolute inset-0 w-full h-full", className)}>
    {avif && <source type="image/avif" srcSet={avif} />}
    {webp && <source type="image/webp" srcSet={webp} />}
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ objectPosition: position }}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  </picture>
);
