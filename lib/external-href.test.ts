import { describe, expect, it } from "vitest";
import { NEW_TAB_REL, externalLinkAttrs, isInternalHref } from "./external-href";

describe("isInternalHref", () => {
  it.each(["/projects", "/about#contact", "/#experience", "/"])("treats %s as internal", (href) => {
    expect(isInternalHref(href)).toBe(true);
  });

  it.each([
    "https://github.com/EvaUnit09",
    "http://example.dev",
    "mailto:noah@example.com",
    "//cdn.example",
  ])("treats %s as external", (href) => {
    expect(isInternalHref(href)).toBe(false);
  });
});

describe("externalLinkAttrs", () => {
  it("leaves internal hrefs in the same tab", () => {
    expect(externalLinkAttrs("/projects")).toEqual({});
  });

  it("opens external hrefs in a new tab with noopener", () => {
    expect(externalLinkAttrs("https://www.moodyalpha.app")).toEqual({
      target: "_blank",
      rel: NEW_TAB_REL,
    });
  });
});
