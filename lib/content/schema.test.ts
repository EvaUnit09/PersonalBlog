// @vitest-environment node
import matter from "gray-matter";
import { FRONTMATTER_OPTIONS } from "./collection";
import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { logFrontmatter, projectFrontmatter } from "./schema";

const PROJECT = "title: Nightcap\nsummary: S\ntags: [FastAPI]\nstatus: in-progress\norder: 1";
const POST = "title: Splitting settings\nexcerpt: E\ntags: [Backend]";

function parse<S extends z.ZodType>(schema: S, yaml: string) {
  return schema.safeParse(matter(`---\n${yaml}\n---\n`, FRONTMATTER_OPTIONS).data);
}

describe("dates", () => {
  it.each([
    ["unquoted", "date: 2026-10-11"],
    ["quoted", 'date: "2026-10-11"'],
  ])("normalizes a %s YAML date to YYYY-MM-DD", (_, line) => {
    const result = parse(logFrontmatter, `${POST}\n${line}`);

    expect(result.success && result.data.date).toBe("2026-10-11");
  });

  it.each([
    ["a non-ISO format", 'date: "11/10/2026"'],
    ["an impossible day, unquoted", "date: 2026-02-30"],
    ["an impossible day, quoted", 'date: "2026-02-30"'],
    ["a timestamp", "date: 2026-10-11T23:30:00-05:00"],
  ])("rejects %s instead of shifting it to another day", (_, line) => {
    expect(parse(logFrontmatter, `${POST}\n${line}`).success).toBe(false);
  });
});

describe("projectFrontmatter", () => {
  it("defaults the optional detail fields", () => {
    const result = parse(projectFrontmatter, PROJECT);

    expect(result.success && result.data).toMatchObject({ spec: [] });
    expect(result.success && result.data.updated).toBeUndefined();
    expect(result.success && result.data.links).toEqual({});
  });

  it("keeps spec rows in authored order", () => {
    const yaml = `${PROJECT}\nspec:\n  - { label: Role, value: Solo }\n  - { label: Backend, value: FastAPI }`;
    const result = parse(projectFrontmatter, yaml);

    expect(result.success && result.data.spec.map((row) => row.label)).toEqual(["Role", "Backend"]);
  });

  it("only accepts https links", () => {
    expect(parse(projectFrontmatter, `${PROJECT}\nlinks: { source: "https://github.com/x/y" }`).success).toBe(true);
    expect(parse(projectFrontmatter, `${PROJECT}\nlinks: { demo: "http://example.dev" }`).success).toBe(false);
    expect(parse(projectFrontmatter, `${PROJECT}\nlinks: { demo: "javascript:alert(1)" }`).success).toBe(false);
  });

  it.each(["https:x.com", "https:/x", "HTTPS://x.com", "https://localhost"])("rejects the malformed link %s", (url) => {
    expect(parse(projectFrontmatter, `${PROJECT}\nlinks: { demo: "${url}" }`).success).toBe(false);
  });
});

describe("logFrontmatter", () => {
  it("requires a date and at least one tag", () => {
    expect(parse(logFrontmatter, POST).success).toBe(false);
    expect(parse(logFrontmatter, "title: T\nexcerpt: E\ntags: []\ndate: 2026-10-11").success).toBe(false);
  });
});
