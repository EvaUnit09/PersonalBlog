import { describe, expect, it } from "vitest";
import { SITE } from "@/content/site";
import { homeMetadata, pageMetadata } from "./page-metadata";

describe("pageMetadata", () => {
  it("prefixes the document title for og and twitter", () => {
    const meta = pageMetadata("About", "A bio.");

    expect(meta).toEqual({
      title: "About",
      description: "A bio.",
      openGraph: {
        title: "Noah Decaille: About",
        description: "A bio.",
        siteName: SITE.name,
        type: "website",
        locale: "en_US",
      },
      twitter: { card: "summary", title: "Noah Decaille: About", description: "A bio." },
    });
  });
});

describe("homeMetadata", () => {
  it("uses the site name with no title-template suffix", () => {
    const meta = homeMetadata();

    expect(meta.title).toBeUndefined();
    expect(meta.description).toBe(SITE.description);
    expect(meta.openGraph).toEqual({
      title: SITE.name,
      description: SITE.description,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    });
    expect(meta.twitter).toEqual({ card: "summary", title: SITE.name, description: SITE.description });
  });
});
