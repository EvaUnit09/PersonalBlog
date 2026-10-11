export interface NavItem {
  index: string;
  label: string;
  href: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export const SITE = {
  name: "Noah Decaille",
  coordinates: "40.7644 N / 73.9235 W",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { index: "01", label: "About", href: "/about" },
  { index: "02", label: "Projects", href: "/projects" },
  { index: "03", label: "Experience", href: "/#experience" },
  { index: "04", label: "Log", href: "/log" },
];

// PLACEHOLDER: replace with real handles before launch (see docs/design-handoff/README.md).
export const CONTACT_LINKS: readonly ContactLink[] = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Email", href: "mailto:hello@example.com" },
];
