import { describe, expect, it } from "vitest";
import { CONTACT_LINKS } from "@/content/site";
import { findPlaceholderLinks } from "./placeholders";

describe("findPlaceholderLinks", () => {
  it("flags example.com addresses and bare profile hosts", () => {
    const links = [
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ];

    expect(findPlaceholderLinks(links).map((link) => link.label)).toEqual(["Email", "GitHub", "LinkedIn"]);
  });

  it("accepts real profile and mail links", () => {
    const links = [
      { label: "Email", href: "mailto:noah@decaille.dev" },
      { label: "GitHub", href: "https://github.com/EvaUnit09" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/someone" },
    ];

    expect(findPlaceholderLinks(links)).toEqual([]);
  });

  it("finds none in the site's contact links, so production builds pass", () => {
    expect(findPlaceholderLinks(CONTACT_LINKS)).toEqual([]);
  });
});
