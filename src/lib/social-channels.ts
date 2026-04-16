import { InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";

export interface SocialChannel {
  name: string;
  href: string;
  /** Brand color for hover/badge accents */
  color: string;
  Icon: typeof InstagramIcon;
}

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/5534992282778",
    color: "#25D366",
    Icon: WhatsAppIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/viniciusmelazzo",
    color: "#E1306C",
    Icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vin%C3%ADcius-melazzo",
    color: "#0A66C2",
    Icon: LinkedInIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@vincius.melazzo",
    color: "#000000",
    Icon: TikTokIcon,
  },
];
