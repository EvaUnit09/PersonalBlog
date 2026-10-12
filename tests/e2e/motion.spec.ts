import { test as freshVisit, type Page } from "@playwright/test";
import { BOOT_TIMING } from "../../lib/boot";
import { expect, test as returningVisit } from "./fixtures";

const BOOT_GONE_BY_MS = 1600;
const FAILSAFE_BY_MS = 2500;
const FAILSAFE_POLL_MS = 5000;
const PAUSE_AT_MS = 50;
const CLOCK_STEP_MS = 16;
const TYPING_POLL_MS = 5000;

type BootProbe = Window & { bootFlagged?: boolean; bootEndedAt?: number; decryptFrameParents?: string[] };

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

// Records the id of every label that gets a decrypt frame, so a short-lived frame can't be missed by polling.
async function probeDecryptFrame(page: Page) {
  await page.addInitScript(() => {
    const probe = window as BootProbe;
    probe.decryptFrameParents = [];
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element && node.matches("[data-decrypt-frame]")) {
            probe.decryptFrameParents?.push(node.parentElement?.id ?? "");
          }
        }
      }
    }).observe(document, { subtree: true, childList: true });
  });
}

function framedLabels(page: Page) {
  return page.evaluate(() => (window as BootProbe).decryptFrameParents ?? []);
}

// The shell stays rendered during the boot, so "hidden" means the overlay is the topmost thing over the headline.
function isHeadlineCovered(page: Page) {
  return page.evaluate(() => {
    const rect = document.querySelector("h1")?.getBoundingClientRect();
    if (rect === undefined) return false;
    const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return top?.closest("[data-boot-overlay]") != null;
  });
}

// Boot timing runs on the page clock, so tests advance it by hand instead of racing real hydration.
async function startPausedBoot(page: Page) {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(PAUSE_AT_MS);
  await probeBoot(page);
  await page.goto("/", { waitUntil: "commit" });
  await expect(skipButton(page)).toBeVisible();
  // Hydration runs on real time, so advance the page clock a frame at a time until typing shows. The poll
  // timeout caps the page clock well under the boot's natural end.
  await expect
    .poll(
      async () => {
        await page.clock.runFor(CLOCK_STEP_MS);
        return page.getByText("mount /projects").isVisible();
      },
      { timeout: TYPING_POLL_MS, intervals: [20] },
    )
    .toBe(true);
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

function isBootPending(page: Page) {
  return page.evaluate(() => document.documentElement.dataset.boot === "pending");
}

freshVisit.describe("boot sequence", () => {
  freshVisit("plays on the first visit and is gone by 1.6s", async ({ page }) => {
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });

    await expect(skipButton(page)).toBeVisible();
    expect(await isHeadlineCovered(page)).toBe(true);
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

  freshVisit("skips on Escape long before the boot would end by itself", async ({ page }) => {
    await startPausedBoot(page);
    expect(await isBootPending(page)).toBe(true);

    await page.keyboard.press("Escape");

    await expect(skipButton(page)).toHaveCount(0);
    expect(await isBootPending(page)).toBe(false);
    expect((await readProbe(page)).bootEndedAt).toBeLessThan(BOOT_TIMING.budgetMs);
  });

  freshVisit("skips on the SKIP button long before the boot would end by itself", async ({ page }) => {
    await startPausedBoot(page);
    expect(await isBootPending(page)).toBe(true);

    await skipButton(page).click();

    await expect(skipButton(page)).toHaveCount(0);
    expect(await isBootPending(page)).toBe(false);
    expect((await readProbe(page)).bootEndedAt).toBeLessThan(BOOT_TIMING.budgetMs);
  });

  freshVisit("reveals the page by CSS alone if the JS bundle never loads", async ({ page }) => {
    await page.route("**/_next/static/chunks/**/*.js", (route) => route.abort());
    await probeBoot(page);
    await page.goto("/", { waitUntil: "commit" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: FAILSAFE_BY_MS });
    await expect.poll(() => isHeadlineCovered(page), { timeout: FAILSAFE_POLL_MS }).toBe(false);
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
    await probeDecryptFrame(page);
    await page.goto("/");
    const panel = page.getByRole("region", { name: "Log" });
    const labelId = await panel.getAttribute("aria-labelledby");
    const label = page.locator(`[id="${labelId}"]`);
    const frame = label.locator("[data-decrypt-frame]");
    await expect(label).not.toBeInViewport();
    expect(await framedLabels(page)).not.toContain(labelId);

    await label.scrollIntoViewIfNeeded();

    await expect.poll(() => framedLabels(page)).toContain(labelId);
    await expect(frame).toHaveCount(0);
    await expect(label).toHaveText("Log");
  });
});
