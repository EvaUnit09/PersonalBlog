import { describe, expect, it } from "vitest";
import { absoluteUrl, getSiteOrigin, resolveSiteOrigin } from "./site-url";

describe("resolveSiteOrigin", () => {
  it("prefers SITE_URL over every Vercel variable and strips trailing slashes", () => {
    const env = {
      SITE_URL: "https://noah.dev//",
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "other.vercel.app",
      VERCEL_URL: "preview.vercel.app",
    };
    expect(resolveSiteOrigin(env)).toBe("https://noah.dev");
  });

  it.each([["not a url"], ["ftp://noah.dev"], ["https://"], ["noah.dev"]])(
    "throws when SITE_URL is malformed (%s)",
    (SITE_URL) => {
      expect(() => resolveSiteOrigin({ SITE_URL })).toThrow(/SITE_URL/);
    },
  );

  it("ignores a blank SITE_URL", () => {
    expect(resolveSiteOrigin({ SITE_URL: "  " })).toBe("http://localhost:3000");
  });

  it("uses the production host with https on a Vercel production build", () => {
    const env = { VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "noah.dev", VERCEL_URL: "x.vercel.app" };
    expect(resolveSiteOrigin(env)).toBe("https://noah.dev");
  });

  it.each([[{}], [{ VERCEL_PROJECT_PRODUCTION_URL: "  " }]])(
    "throws naming both variables when a production build has no host (%o)",
    (extra) => {
      const failure = () => resolveSiteOrigin({ VERCEL_ENV: "production", VERCEL_URL: "x.vercel.app", ...extra });
      expect(failure).toThrow(/SITE_URL/);
      expect(failure).toThrow(/VERCEL_PROJECT_PRODUCTION_URL/);
    },
  );

  it.each([["preview"], ["development"]])("uses VERCEL_URL on a %s deployment", (VERCEL_ENV) => {
    const env = { VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL: "noah.dev", VERCEL_URL: "x-abc.vercel.app" };
    expect(resolveSiteOrigin(env)).toBe("https://x-abc.vercel.app");
  });

  it("falls back to localhost when nothing is set", () => {
    expect(resolveSiteOrigin({})).toBe("http://localhost:3000");
  });

  it("getSiteOrigin resolves the same rule against a passed env", () => {
    expect(getSiteOrigin({ SITE_URL: "https://noah.dev" })).toBe("https://noah.dev");
  });
});

describe("absoluteUrl", () => {
  it("joins a path onto the origin", () => {
    expect(absoluteUrl("/log/a", "https://noah.dev")).toBe("https://noah.dev/log/a");
  });

  it("maps the root path to the bare origin with a trailing slash", () => {
    expect(absoluteUrl("/", "https://noah.dev")).toBe("https://noah.dev/");
  });

  it("tolerates a trailing slash on the origin", () => {
    expect(absoluteUrl("/log/a", "https://noah.dev/")).toBe("https://noah.dev/log/a");
  });

  it("tolerates a path without a leading slash", () => {
    expect(absoluteUrl("log/a", "https://noah.dev")).toBe("https://noah.dev/log/a");
  });
});
