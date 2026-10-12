// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { Entry } from "./collection";
import { toProjectList } from "./projects";
import type { ProjectFrontmatter } from "./schema";

function entry(slug: string, order: number): Entry<ProjectFrontmatter> {
  return {
    slug,
    data: { title: slug, summary: `${slug} summary`, tags: ["Tag"], status: "shipped", order, links: {}, spec: [] },
    body: `${slug} body`,
  };
}

describe("toProjectList", () => {
  it("flattens entries and sorts them by order, featured first", () => {
    const projects = toProjectList([entry("gamma", 3), entry("alpha", 1), entry("beta", 2)]);

    expect(projects.map((p) => p.slug)).toEqual(["alpha", "beta", "gamma"]);
    expect(projects[0]).toMatchObject({ slug: "alpha", title: "alpha", order: 1, body: "alpha body" });
  });

  it("fails the build when there is no project to feature", () => {
    expect(() => toProjectList([])).toThrow(/featured/);
  });

  it.each([
    ["a gap", [1, 3]],
    ["a repeat", [1, 1]],
    ["no first project", [2, 3]],
  ])("rejects order with %s", (_, orders) => {
    const entries = orders.map((order, i) => entry(`p${i}`, order));

    expect(() => toProjectList(entries)).toThrow(/^Project order must run 1\.\.2/);
  });
});
