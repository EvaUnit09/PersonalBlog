import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap-entries";

const origin = "https://noah.dev";

describe("buildSitemap", () => {
  it("lists the static pages, every project and every post, with sections in site order", () => {
    const urls = buildSitemap({
      origin,
      projects: [{ slug: "nightcap" }, { slug: "foodsy" }],
      posts: [{ slug: "first", date: "2026-01-01" }],
    }).map((entry) => entry.url);

    expect(urls).toEqual([
      "https://noah.dev/",
      "https://noah.dev/about",
      "https://noah.dev/projects",
      "https://noah.dev/projects/nightcap",
      "https://noah.dev/projects/foodsy",
      "https://noah.dev/log",
      "https://noah.dev/log/first",
    ]);
  });

  it("sets lastModified from a project's updated date only when it has one", () => {
    const entries = buildSitemap({
      origin,
      projects: [{ slug: "a", updated: "2026-03-04" }, { slug: "b" }],
      posts: [],
    });

    expect(entries.find((e) => e.url.endsWith("/a"))).toHaveProperty("lastModified", "2026-03-04");
    expect(entries.find((e) => e.url.endsWith("/b"))).not.toHaveProperty("lastModified");
  });

  it("sets lastModified from a post's date", () => {
    const entries = buildSitemap({ origin, projects: [], posts: [{ slug: "p", date: "2026-05-06" }] });

    expect(entries.find((e) => e.url.endsWith("/p"))).toHaveProperty("lastModified", "2026-05-06");
  });
});
