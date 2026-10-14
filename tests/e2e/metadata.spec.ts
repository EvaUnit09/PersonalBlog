import { ABOUT } from "../../content/about";
import { LOG_DESCRIPTION } from "../../content/log";
import { SITE } from "../../content/site";
import { expect, test } from "./fixtures";

const ABOUT_DESCRIPTION = `${ABOUT.headline} Network infrastructure in Okinawa, film school in Los Angeles, then software at BBC Studios.`;
const PROJECTS_DESCRIPTION = "Backend and full-stack projects I have built, with stack and status.";
const NIGHTCAP_DESCRIPTION =
  "Turns a natural language request into 2 to 3 complete night-out itineraries for dates or friend hangouts. NYC first.";

async function expectShareTags(
  page: import("@playwright/test").Page,
  title: string,
  description: string,
) {
  const ogTitle = page.locator('meta[property="og:title"]');
  const ogDescription = page.locator('meta[property="og:description"]');
  const twitterTitle = page.locator('meta[name="twitter:title"]');
  const twitterDescription = page.locator('meta[name="twitter:description"]');

  await expect(ogTitle).toHaveCount(1);
  await expect(ogDescription).toHaveCount(1);
  await expect(twitterTitle).toHaveCount(1);
  await expect(twitterDescription).toHaveCount(1);
  await expect(ogTitle).toHaveAttribute("content", title);
  await expect(ogDescription).toHaveAttribute("content", description);
  await expect(twitterTitle).toHaveAttribute("content", title);
  await expect(twitterDescription).toHaveAttribute("content", description);
}

test("home has its own og and twitter title and description", async ({ page }) => {
  await page.goto("/");
  await expectShareTags(page, SITE.name, SITE.description);
});

test("about has its own og and twitter title and description", async ({ page }) => {
  await page.goto("/about");
  await expectShareTags(page, "Noah Decaille: About", ABOUT_DESCRIPTION);
});

test("projects index has its own og and twitter title and description", async ({ page }) => {
  await page.goto("/projects");
  await expectShareTags(page, "Noah Decaille: Projects", PROJECTS_DESCRIPTION);
});

test("a project page has its own og and twitter title and description", async ({ page }) => {
  await page.goto("/projects/nightcap");
  await expectShareTags(page, "Noah Decaille: NightCap", NIGHTCAP_DESCRIPTION);
});

test("log index has its own og and twitter title and description", async ({ page }) => {
  await page.goto("/log");
  await expectShareTags(page, "Noah Decaille: Log", LOG_DESCRIPTION);
});
