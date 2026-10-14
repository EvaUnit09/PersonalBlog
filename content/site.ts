import type { PanelIndex } from "@/components/hud/PanelHeader";

export interface NavItem {
  index: Exclude<PanelIndex, "//">;
  label: string;
  /** Site-relative route or in-page anchor, never an external URL. */
  href: `/${string}`;
}

export interface ContactLink {
  label: string;
  href: string;
}

export const SITE = {
  name: "Noah Decaille",
  description:
    "Backend engineer. Marine turned developer. USMC networks, film school, then BBC Studios.",
  location: "New York, NY",
} as const;

export const NAV_ITEMS = [
  { index: "01", label: "About", href: "/about" },
  { index: "02", label: "Projects", href: "/projects" },
  { index: "03", label: "Experience", href: "/#experience" },
  { index: "04", label: "Log", href: "/log" },
] as const satisfies readonly NavItem[];

export const CONTACT_LINKS: readonly ContactLink[] = [
  { label: "GitHub", href: "https://github.com/EvaUnit09" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/noahdecaille" },
  { label: "Email", href: "mailto:noahdecaille@gmail.com" },
];
