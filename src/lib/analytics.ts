/**
 * Unified analytics helper for Meta Pixel, Google Tag (GA4 + Google Ads),
 * and TikTok Pixel. All tracking is gated by the user's cookie consent
 * (Google Consent Mode v2).
 *
 * The pixel IDs live in `window.__MELAZZO_TRACKING__` (set in index.html).
 * Leave them empty during preview — the helper silently no-ops until the
 * IDs are populated.
 */

declare global {
  interface Window {
    __MELAZZO_TRACKING__?: {
      META_PIXEL_ID?: string;
      GA4_MEASUREMENT_ID?: string;
      GOOGLE_ADS_ID?: string;
      TIKTOK_PIXEL_ID?: string;
    };
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void; load: (id: string) => void; page: () => void };
    dataLayer?: unknown[];
  }
}

const CONSENT_KEY = "melazzo:consent:v1";

export type ConsentState = "granted" | "denied" | "unknown";

export const getConsent = (): ConsentState => {
  if (typeof window === "undefined") return "unknown";
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return "unknown";
};

export const setConsent = (state: "granted" | "denied") => {
  localStorage.setItem(CONSENT_KEY, state);
  // Update Google Consent Mode v2
  if (window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
  // Trigger pixel loads if newly granted
  if (state === "granted") loadPixels();
  window.dispatchEvent(new CustomEvent("melazzo:consent", { detail: state }));
};

let pixelsLoaded = false;
const loadPixels = () => {
  if (pixelsLoaded || typeof window === "undefined") return;
  const cfg = window.__MELAZZO_TRACKING__ ?? {};
  pixelsLoaded = true;

  // Meta Pixel
  if (cfg.META_PIXEL_ID) {
    /* eslint-disable */
    (function (f: any, b, e, v, n?: any, t?: any, s?: any) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq?.("init", cfg.META_PIXEL_ID);
    window.fbq?.("track", "PageView");
  }

  // GA4 + Google Ads (via gtag.js)
  const gIds = [cfg.GA4_MEASUREMENT_ID, cfg.GOOGLE_ADS_ID].filter(Boolean) as string[];
  if (gIds.length) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gIds[0]}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); } as any;
    window.gtag("js", new Date());
    gIds.forEach((id) => window.gtag!("config", id));
  }

  // TikTok Pixel
  if (cfg.TIKTOK_PIXEL_ID) {
    /* eslint-disable */
    (function (w: any, d, t) {
      w.TiktokAnalyticsObject = t; const ttq = (w[t] = w[t] || []);
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function (t: any, e: any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: string) { const e = ttq._i[t] || []; for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e: string) {
        const n = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = n;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = {};
        const o = document.createElement("script");
        o.type = "text/javascript"; o.async = !0; o.src = n + "?sdkid=" + e + "&lib=" + t;
        const a = document.getElementsByTagName("script")[0];
        a.parentNode!.insertBefore(o, a);
      };
      ttq.load(cfg.TIKTOK_PIXEL_ID!);
      ttq.page();
    })(window, document, "ttq");
    /* eslint-enable */
  }
};

/**
 * Initialise tracking on app start. Sets default Consent Mode (denied)
 * and loads pixels if consent was previously granted.
 */
export const initAnalytics = () => {
  if (typeof window === "undefined") return;
  // Default Consent Mode v2 — denied until user explicitly accepts
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); } as any;
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  if (getConsent() === "granted") {
    setConsent("granted"); // re-applies + loads pixels
  }
};

/**
 * Fire a unified conversion event across all platforms. Common events:
 * - "Lead": form submission
 * - "InitiateCheckout": user clicked buy button
 * - "Purchase": payment confirmed (also sent server-side via webhook)
 */
export const trackEvent = (
  event: "Lead" | "InitiateCheckout" | "Purchase" | "ViewContent" | "PageView",
  params: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;

  // Meta
  window.fbq?.("track", event, params);

  // Google (gtag) — map to standard event names
  const gMap: Record<string, string> = {
    Lead: "generate_lead",
    InitiateCheckout: "begin_checkout",
    Purchase: "purchase",
    ViewContent: "view_item",
    PageView: "page_view",
  };
  window.gtag?.("event", gMap[event] ?? event, params);

  // TikTok
  window.ttq?.track(event, params);
};
