import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOOT_HOLD_MS, BOOT_TIMING } from "@/lib/boot";

const FAILSAFE_DELAY = /animation:\s*failsafe-hide\s+\S+\s+\S+\s+([\d.]+)(ms|s)\b/;

function failsafeDelayMs(css: string): number {
  const match = FAILSAFE_DELAY.exec(css);
  if (!match) throw new Error("BootSequence.module.css has no `animation: failsafe-hide <duration> <timing> <delay>` declaration");
  const [, amount, unit] = match;
  return Number(amount) * (unit === "s" ? 1000 : 1);
}

describe("boot CSS failsafe (source-level guard)", () => {
  it("source-level guard: the failsafe delay in the CSS exceeds the boot budget plus hold", () => {
    const css = readFileSync(join(__dirname, "BootSequence.module.css"), "utf8");

    const delayMs = failsafeDelayMs(css);

    expect(delayMs).toBeGreaterThan(BOOT_TIMING.budgetMs + BOOT_HOLD_MS);
  });
});
