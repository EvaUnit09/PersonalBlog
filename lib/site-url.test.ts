import { describe, expect, it } from "vitest";
import { absoluteUrl, getSiteOrigin } from "./site-url";

describe("getSiteOrigin", () => {
  it("builds an https origin from the Vercel production host", () => {
    expect(getSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "noah.dev" })).toBe("https://noah.dev");
  });

  it.each([[{}], [{ VERCEL_PROJECT_PRODUCTION_URL: "" }], [{ VERCEL_PROJECT_PRODUCTION_URL: "  " }]])(
    "falls back to localhost when the host is unset or blank (%o)",
    (env) => {
      expect(getSiteOrigin(env)).toBe("http://localhost:3000");
    },
  );
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
