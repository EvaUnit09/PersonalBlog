import { expect, test } from "@playwright/test";

const PANEL_NAMES_IN_ORDER = [
  { role: "region", name: /Backend engineer/ },
  { role: "complementary", name: "Status" },
  { role: "region", name: "Nightcap" },
  { role: "complementary", name: "More projects" },
  { role: "region", name: "Experience" },
  { role: "complementary", name: "Stack" },
  { role: "region", name: "Log" },
] as const;

test("home panels render in order with accessible names", async ({ page }) => {
  await page.goto("/");

  for (const { role, name } of PANEL_NAMES_IN_ORDER) {
    await expect(page.getByRole(role, { name })).toBeVisible();
  }
  const handles = await Promise.all(
    PANEL_NAMES_IN_ORDER.map(({ role, name }) => page.getByRole(role, { name }).elementHandle()),
  );
  for (let i = 1; i < handles.length; i++) {
    const isFollowing = await page.evaluate(
      ([a, b]) => Boolean(a!.compareDocumentPosition(b!) & Node.DOCUMENT_POSITION_FOLLOWING),
      [handles[i - 1], handles[i]],
    );
    expect(isFollowing, `panel ${i} follows panel ${i - 1}`).toBe(true);
  }
});

test("experience anchor target exists and the nav link resolves to it", async ({ page }) => {
  await page.goto("/#experience");

  await expect(page.locator("section#experience")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /Experience/ })).toHaveAttribute("href", "/#experience");
});

test("empty log shows its empty state", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("region", { name: "Log" }).getByText("NO ENTRIES YET")).toBeVisible();
});

test("status panel has no BUILD readout", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("complementary", { name: "Status" })).not.toContainText("BUILD");
});

test("panels stack in a single column below 900px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
  await page.goto("/");

  const lefts = await page
    .locator("main > *")
    .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));
  const widths = await page
    .locator("main > *")
    .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().width)));

  expect(new Set(lefts).size).toBe(1);
  expect(new Set(widths).size).toBe(1);
});

test("panels sit side by side on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop viewport only");
  await page.goto("/");

  const hero = await page.getByRole("region", { name: /Backend engineer/ }).boundingBox();
  const status = await page.getByRole("complementary", { name: "Status" }).boundingBox();

  expect(status!.x).toBeGreaterThan(hero!.x + hero!.width - 1);
  expect(Math.abs(status!.y - hero!.y)).toBeLessThan(2);
});
