import { expect, test, type Page } from "@playwright/test";

const SCANLINE_OPACITY = "0.035";

function getScanlineStyle(page: Page) {
  return page.evaluate(() => {
    const style = getComputedStyle(document.body, "::before");
    return { content: style.content, opacity: style.opacity, pointerEvents: style.pointerEvents };
  });
}

test.describe("theme", () => {
  test.use({ colorScheme: "light" });

  test("follows the system scheme before first paint with no hydration errors", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      const isNoise = message.text().startsWith("Failed to load resource"); // prefetches of routes not built yet
      if (!isNoise && (message.type() === "error" || message.type() === "warning")) problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));

    await page.goto("/");
    const themeRightAfterLoad = await page.evaluate(() => document.documentElement.dataset.theme);
    await expect(page.getByRole("button", { name: "LIGHT" })).toHaveAttribute("aria-pressed", "true");

    expect(themeRightAfterLoad).toBe("light");
    expect(problems).toEqual([]);
  });

  test("a stored choice survives reload and beats the system scheme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "DARK" }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "DARK" })).toHaveAttribute("aria-pressed", "true");

    await page.reload();

    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
    await expect(page.getByRole("button", { name: "DARK" })).toHaveAttribute("aria-pressed", "true");
  });

  test("scanlines render in dark only and never intercept input", async ({ page }) => {
    await page.goto("/");
    expect((await getScanlineStyle(page)).content).toBe("none");

    await page.getByRole("button", { name: "DARK" }).click();
    const dark = await getScanlineStyle(page);
    expect(dark).toEqual({ content: '""', opacity: SCANLINE_OPACITY, pointerEvents: "none" });

    await page.getByRole("button", { name: "LIGHT" }).click();
    expect((await getScanlineStyle(page)).content).toBe("none");
  });

  test("toggle is reachable and operable by keyboard", async ({ page, isMobile }) => {
    test.skip(isMobile, "no hardware keyboard on the mobile project");
    await page.goto("/");

    const dark = page.getByRole("button", { name: "DARK" });
    await dark.focus();
    await expect(dark).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "LIGHT" })).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("tabbing from the nav reaches the toggle", async ({ page, isMobile }) => {
    test.skip(isMobile, "no hardware keyboard on the mobile project");
    await page.goto("/");

    const lastNavLink = page.getByRole("navigation", { name: "Primary" }).getByRole("link").last();
    await lastNavLink.focus();
    await page.keyboard.press("Tab");

    await expect(page.getByRole("button", { name: "DARK" })).toBeFocused();
  });
});
