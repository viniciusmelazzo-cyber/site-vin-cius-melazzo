import { ReadingProgress, BackToTop } from "@/components/ux/ReadingProgress";
import SocialFloat from "@/components/SocialFloat";

/**
 * Global UX overlays: reading progress bar (top), back-to-top button (bottom-left),
 * and social channels floating button (bottom-right). Drop once per public page,
 * AFTER the main content.
 */
const SiteChrome = () => (
  <>
    <ReadingProgress />
    <BackToTop />
    <SocialFloat />
  </>
);

export default SiteChrome;
