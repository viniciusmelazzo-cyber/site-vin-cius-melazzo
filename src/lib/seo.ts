/**
 * Lightweight SEO helper to set <title>, meta description and Open Graph
 * tags per page without bringing in react-helmet.
 */

interface SeoOptions {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
}

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [, key] = selector.match(/\[(.*?)="(.*?)"\]/) ?? [];
    if (key) el.setAttribute(key, selector.match(/="(.*?)"/)?.[1] ?? "");
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const upsertMeta = (key: "name" | "property", value: string, content: string) => {
  let el = document.querySelector(`meta[${key}="${value}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.content = content;
};

const upsertCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

export const applySeo = ({
  title,
  description,
  canonical,
  ogImage = "https://melazzo.co/og-image.jpg",
  ogType = "website",
}: SeoOptions) => {
  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);
  upsertMeta("name", "twitter:card", "summary_large_image");
  if (canonical) {
    upsertCanonical(canonical);
    upsertMeta("property", "og:url", canonical);
  }
};
