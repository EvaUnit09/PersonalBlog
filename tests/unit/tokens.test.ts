// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tokensCss = readFileSync(resolve("styles/tokens.css"), "utf8");
const tokensJson = readFileSync(resolve("docs/design-handoff/design-system/tokens.json"), "utf8");

describe("styles/tokens.css", () => {
  it("defines both themes", () => {
    expect(tokensCss).toContain('[data-theme="dark"]');
    expect(tokensCss).toContain('[data-theme="light"]');
  });

  it("uses the deepened accent-text in the light theme for contrast", () => {
    const light = tokensCss.slice(tokensCss.indexOf('[data-theme="light"]'));
    expect(light).toMatch(/--accent-text:\s*#4a7300/i);
  });

  it("stays in sync with the design handoff colors", () => {
    const hexes = tokensJson.match(/#[0-9a-f]{6}/gi) ?? [];
    expect(hexes.length).toBeGreaterThan(0);
    for (const hex of new Set(hexes.map((h) => h.toLowerCase()))) {
      expect(tokensCss.toLowerCase()).toContain(hex);
    }
  });
});
