import type { NextConfig } from "next";
import { CONTACT_LINKS } from "./content/site";
import { findPlaceholderLinks } from "./lib/placeholders";

// Block production deploys while the footer still links to handoff placeholders.
// Previews and local builds are allowed so work can continue before real handles exist.
if (process.env.VERCEL_ENV === "production") {
  const placeholders = findPlaceholderLinks(CONTACT_LINKS);
  if (placeholders.length > 0) {
    const labels = placeholders.map((link) => link.label).join(", ");
    throw new Error(`Replace placeholder contact links in content/site.ts before deploying: ${labels}`);
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
