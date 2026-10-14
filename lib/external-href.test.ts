import { describe, expect, it } from "vitest";
import { NEW_TAB_REL, externalLinkAttrs, isExternalHref, isInternalHref } from "./external-href";

const ORIGIN = "https://noah.dev";

describe("isInternalHref", () => {
  it.each(["/projects", "/about#contact", "/#experience", "/"])("treats %s as a site-relative path", (href) => {
    expect(isInternalHref(href)).toBe(true);
  });

  it.each(["https://github.com/EvaUnit09", "http://example.dev", "//cdn.example", "mailto:a@b.dev"])(
    "does not treat %s as a site-relative path",
    (href) => {
      expect(isInternalHref(href)).toBe(false);
    },
  );
});

describe("isExternalHref", () => {
  it.each(["https://github.com/EvaUnit09", "http://example.dev", "HTTP://EXAMPLE.DEV/x", "//cdn.example"])(
    "treats %s as external",
    (href) => {
      expect(isExternalHref(href, ORIGIN)).toBe(true);
    },
  );

  it.each([
    "#contact",
    "about",
    "./write-up",
    "?q=1",
    "mailto:noah@example.com",
    "tel:+15555550100",
    "https://noah.dev",
    "https://noah.dev/about",
    "//noah.dev/projects",
    "/projects",
  ])("does not treat %s as external", (href) => {
    expect(isExternalHref(href, ORIGIN)).toBe(false);
  });
});

describe("externalLinkAttrs", () => {
  it("leaves non-external hrefs in the same tab", () => {
    expect(externalLinkAttrs("mailto:a@b.dev", ORIGIN)).toEqual({});
    expect(externalLinkAttrs("/projects", ORIGIN)).toEqual({});
    expect(externalLinkAttrs("https://noah.dev/about", ORIGIN)).toEqual({});
  });

  it("opens off-site http(s) and protocol-relative hrefs in a new tab", () => {
    expect(externalLinkAttrs("https://www.moodyalpha.app", ORIGIN)).toEqual({
      target: "_blank",
      rel: NEW_TAB_REL,
    });
    expect(externalLinkAttrs("//cdn.example", ORIGIN)).toEqual({
      target: "_blank",
      rel: NEW_TAB_REL,
    });
  });
});
