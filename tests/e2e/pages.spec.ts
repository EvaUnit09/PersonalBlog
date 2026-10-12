import { expect, test } from "./fixtures";

const PROJECT_SLUGS = ["nightcap", "foodsy", "opsagent", "ticketing"] as const;

function primaryNav(page: import("@playwright/test").Page) {
  return page.getByRole("navigation", { name: "Primary" });
}

test("about renders its h1, labelled panels and the #contact anchor target", async ({ page }) => {
  await page.goto("/about");

  await expect(page).toHaveTitle("Noah Decaille: About");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Marine, filmmaker, now backend engineer.");
  await expect(page.getByRole("complementary", { name: "Identity" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Path" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Stack" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Contact" })).toHaveAttribute("id", "contact");
  await expect(primaryNav(page).getByRole("link", { name: /About/ })).toHaveAttribute("aria-current", "page");
});

test("the home Contact button lands on the about contact panel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Contact", exact: true }).click();

  await expect(page).toHaveURL(/\/about#contact$/);
  await expect(page.locator("#contact")).toBeVisible();
});

test("projects index lists every project in order and links to each", async ({ page }) => {
  await page.goto("/projects");

  await expect(page).toHaveTitle("Noah Decaille: Projects");
  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeAttached();
  const region = page.getByRole("region", { name: "Projects" });
  await expect(region).toContainText("04 TOTAL");
  const hrefs = await region.getByRole("link").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual(PROJECT_SLUGS.map((slug) => `/projects/${slug}`));
  await expect(primaryNav(page).getByRole("link", { name: /Projects/ })).toHaveAttribute("aria-current", "page");
});

test("project detail renders its parts and keeps Projects marked in the nav", async ({ page }) => {
  await page.goto("/projects/nightcap");

  await expect(page).toHaveTitle("Noah Decaille: Nightcap");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nightcap");
  await expect(primaryNav(page).getByRole("link", { name: /Projects/ })).toHaveAttribute("aria-current", "page");
  const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumbs).toHaveText("◂ ALL PROJECTS · 02 / PROJECT 01 OF 04");
  await expect(page.getByRole("complementary", { name: "Project facts" })).toContainText("IN PROGRESS");
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("project detail links only the existing neighbor at the ends of the list", async ({ page }) => {
  await page.goto("/projects/nightcap");
  const nav = page.getByRole("navigation", { name: "Project navigation" });
  await expect(nav.getByRole("link")).toHaveCount(1);
  await expect(nav.getByRole("link", { name: /NEXT/ })).toHaveAttribute("href", "/projects/foodsy");

  await page.goto("/projects/ticketing");
  await expect(nav.getByRole("link")).toHaveCount(1);
  await expect(nav.getByRole("link", { name: /PREVIOUS/ })).toHaveAttribute("href", "/projects/opsagent");
});

test("log index shows its empty state and advertises the feed", async ({ page }) => {
  await page.goto("/log");

  await expect(page).toHaveTitle("Noah Decaille: Log");
  await expect(page.getByRole("heading", { level: 1, name: "Log" })).toBeAttached();
  await expect(page.getByText("NO ENTRIES YET")).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: /Log/ })).toHaveAttribute("aria-current", "page");
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    "href",
    /\/log\/feed\.xml$/,
  );
});

// The proxy answers unknown slugs itself, so even the first request to a fresh server is a 404 with the not-found UI.
for (const path of ["/projects/nope", "/log/nope", "/log/__placeholder__"]) {
  test(`${path} is a 404 with the not-found page on the first request`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    await expect(page.getByText("This page could not be found.")).toBeVisible();
  });
}

for (const path of ["/projects/nightcap", "/log/feed.xml"]) {
  test(`${path} is still served with a 200`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

test("the RSS feed is served as XML and parses as an RSS 2.0 channel", async ({ page, request }) => {
  const response = await request.get("/log/feed.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/rss\+xml|xml/);
  const parsed = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return {
      hasError: doc.querySelector("parsererror") !== null,
      version: doc.documentElement.getAttribute("version"),
      title: doc.querySelector("channel > title")?.textContent,
    };
  }, await response.text());
  expect(parsed).toEqual({ hasError: false, version: "2.0", title: "Noah Decaille: Log" });
});

test("the sitemap lists every project and the static pages, but not the placeholder", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc!).pathname);

  expect(response.status()).toBe(200);
  expect(paths).toEqual(["/", "/about", "/projects", ...PROJECT_SLUGS.map((s) => `/projects/${s}`), "/log"]);
});
