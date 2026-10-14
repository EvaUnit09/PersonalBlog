import { expect, test } from "./fixtures";

const PANEL_NAMES_IN_ORDER = [
  { role: "region", name: /Backend engineer/ },
  { role: "complementary", name: "Status" },
  { role: "region", name: "Featured" },
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

test("status panel keeps location at city level with no GPS coordinates", async ({ page }) => {
  await page.goto("/");
  const status = page.getByRole("complementary", { name: "Status" });

  await expect(status).toContainText("NYC, ET");
  await expect(status).not.toContainText("COORD");
  await expect(status).not.toContainText(/40\.76|-73\.92/);
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

test("featured shows NightCap and Moody with their own counters and live demos", async ({ page }) => {
  await page.goto("/");
  const featured = page.getByRole("region", { name: "Featured" });
  const nightcap = featured.getByRole("article", { name: "NightCap" });
  const moody = featured.getByRole("article", { name: "Moody" });

  await expect(nightcap).toContainText("PROJECT 01 OF 04");
  await expect(moody).toContainText("PROJECT 03 OF 04");
  await expect(nightcap.getByRole("link", { name: /Live demo/ })).toHaveAttribute(
    "href",
    "https://nightcap-dusky.vercel.app",
  );
  await expect(moody.getByRole("link", { name: /Live demo/ })).toHaveAttribute(
    "href",
    "https://www.moodyalpha.app",
  );
  const alsoBuilt = page.getByRole("complementary", { name: "More projects" });
  await expect(alsoBuilt).toContainText("Foodsy");
  await expect(alsoBuilt).toContainText("The Round Up");
  await expect(alsoBuilt).not.toContainText("NightCap");
  await expect(alsoBuilt).not.toContainText("Moody");
});

test("panels sit side by side on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop viewport only");
  await page.goto("/");

  const hero = await page.getByRole("region", { name: /Backend engineer/ }).boundingBox();
  const status = await page.getByRole("complementary", { name: "Status" }).boundingBox();

  expect(status!.x).toBeGreaterThan(hero!.x + hero!.width - 1);
  expect(Math.abs(status!.y - hero!.y)).toBeLessThan(2);
});
