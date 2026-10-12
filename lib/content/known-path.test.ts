import { describe, expect, test } from "vitest";
import { isKnownPath, type SlugManifest } from "./known-path";

const manifest: SlugManifest = { projects: ["nightcap"], log: ["first-post"] };

describe("isKnownPath", () => {
  test.each(["/projects/nightcap", "/projects/nightcap/", "/log/first-post"])("passes known slug %s", (path) => {
    expect(isKnownPath(path, manifest)).toBe(true);
  });

  test.each(["/projects/nope", "/log/nope", "/log/__placeholder__", "/projects/__placeholder__", "/projects/%E0%A4%A"])(
    "rejects unknown slug %s",
    (path) => {
      expect(isKnownPath(path, manifest)).toBe(false);
    },
  );

  test("lets the feed route through but only under /log", () => {
    expect(isKnownPath("/log/feed.xml", manifest)).toBe(true);
    expect(isKnownPath("/projects/feed.xml", manifest)).toBe(false);
  });

  test("does not judge a slug from the other collection", () => {
    expect(isKnownPath("/log/nightcap", manifest)).toBe(false);
  });

  test.each(["/", "/about", "/projects", "/log", "/projects/nightcap/extra", "/other/thing"])(
    "ignores paths that are not a slug route: %s",
    (path) => {
      expect(isKnownPath(path, manifest)).toBe(true);
    },
  );
});
