import { test as freshVisit, type Page } from "@playwright/test";
import { BOOT_TIMING } from "../../lib/boot";
import { expect, test as returningVisit } from "./fixtures";

const BOOT_GONE_BY_MS = 1600;
const FAILSAFE_BY_MS = 2500;

type BootProbe = Window & { bootFlagged?: boolean; bootEndedAt?: number };

// Records whether the pre-paint script ever flagged the boot, and when the flag was cleared.
async function probeBoot(page: Page) {
  await page.addInitScript(() => {
    const probe = window as BootProbe;
    probe.bootFlagged = false;
    new MutationObserver(() => {
      const isPending = document.documentElement?.dataset.boot === "pending";
      if (isPending) probe.bootFlagged = true;
      else if (probe.bootFlagged && probe.bootEndedAt === undefined) probe.bootEndedAt = performance.now();
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-boot"] });
  });
}

function readProbe(page: Page) {
  return page.evaluate(() => {
    const { bootFlagged, bootEndedAt } = window as BootProbe;
    return { bootFlagged, bootEndedAt };
  });
}

function skipButton(page: Page) {
  return page.getByRole("button", { name: "Skip intro" });
}

async function waitForTyping(page: Page) {
  await expect(page.getByText("mount /projects")).toBeVisible();
}

freshVisit.describe("boot sequence", () => {
  freshVisit("plays on the first visit and is gone by 1.6s", async ({ page }) => {
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });

    await expect(skipButton(page)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeHidden();
    await expect(skipButton(page)).toBeHidden();

    const { bootFlagged, bootEndedAt } = await readProbe(page);
    expect(bootFlagged).toBe(true);
    expect(bootEndedAt).toBeLessThan(BOOT_GONE_BY_MS);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  freshVisit("never plays again in the same session", async ({ page }) => {
    await probeBoot(page);
    await page.goto("/");
    await expect(skipButton(page)).toBeHidden();

    await page.reload();

    expect((await readProbe(page)).bootFlagged).toBe(false);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(skipButton(page)).toHaveCount(0);
  });

  freshVisit("skips on Escape", async ({ page }) => {
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });
    await waitForTyping(page);

    await page.keyboard.press("Escape");

    await expect(skipButton(page)).toBeHidden();
    expect((await readProbe(page)).bootEndedAt).toBeLessThan(BOOT_TIMING.budgetMs);
  });

  freshVisit("skips on the SKIP button", async ({ page }) => {
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });
    await waitForTyping(page);

    await skipButton(page).click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect((await readProbe(page)).bootEndedAt).toBeLessThan(BOOT_TIMING.budgetMs);
  });

  freshVisit("reveals the page by CSS alone if the JS bundle never loads", async ({ page }) => {
    await page.route("**/_next/static/chunks/**/*.js", (route) => route.abort());
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: FAILSAFE_BY_MS });
    expect((await readProbe(page)).bootFlagged).toBe(true);
    await expect(skipButton(page)).toBeHidden();
  });

  freshVisit.describe("with reduced motion", () => {
    freshVisit.use({ reducedMotion: "reduce" });

    freshVisit("never plays", async ({ page }) => {
      await probeBoot(page);
      await page.goto("/");

      expect((await readProbe(page)).bootFlagged).toBe(false);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(skipButton(page)).toBeHidden();
    });
  });

  freshVisit.describe("without JavaScript", () => {
    freshVisit.use({ javaScriptEnabled: false });

    freshVisit("shows the page and no overlay text", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: FAILSAFE_BY_MS });
      await expect(page.getByText("[ SKIP ]")).toBeHidden();
    });
  });
});

returningVisit.describe("decrypt", () => {
  returningVisit("keeps panel accessible names", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("region", { name: "Experience" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Log" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Status" })).toBeVisible();
  });

  returningVisit("scrambles a label once in view and settles on its final text", async ({ page }) => {
    await page.goto("/");
    const panel = page.getByRole("region", { name: "Log" });
    const label = page.locator(`[id="${await panel.getAttribute("aria-labelledby")}"]`);
    const frame = label.locator("[data-decrypt-frame]");
    await expect(label).not.toBeInViewport();

    await label.scrollIntoViewIfNeeded();
    await expect(frame).toBeAttached();
    await page.waitForTimeout(500);

    await expect(frame).toHaveCount(0);
    await expect(label).toHaveText("Log");
  });
});
