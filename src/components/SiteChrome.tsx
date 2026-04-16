import { ReadingProgress, BackToTop } from "@/components/ux/ReadingProgress";
import SocialFloat from "@/components/SocialFloat";
import CookieConsent from "@/components/CookieConsent";

/**
 * Global UX overlays: reading progress bar, back-to-top, social FAB and
 * LGPD cookie consent. Drop once per public page, AFTER the main content.
 */
const SiteChrome = () => (
  <>
    <ReadingProgress />
    <BackToTop />
    <SocialFloat />
    <CookieConsent />
  </>
);

export default SiteChrome;
