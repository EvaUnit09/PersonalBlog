import { expect, test } from "./fixtures";

const LIME = "rgb(198, 255, 61)";

test("panel brackets turn lime on hover", async ({ page }) => {
  await page.goto("/");
  const panel = page.getByRole("complementary", { name: "Status" });
  const corner = panel.locator("[data-bracket]").first();

  await expect(corner).not.toHaveCSS("border-top-color", LIME);
  await panel.hover();
  await expect(corner).toHaveCSS("border-top-color", LIME);
});

test("panel brackets turn lime when focus moves inside", async ({ page }) => {
  await page.goto("/");
  const panel = page.getByRole("region", { name: /Backend engineer/ });
  const corner = panel.locator("[data-bracket]").first();

  await panel.getByRole("link", { name: /View projects/ }).focus();
  await expect(corner).toHaveCSS("border-top-color", LIME);
});

test("primary nav lists four sections and the footer lists contacts", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link")).toHaveCount(4);
  await expect(page.getByRole("contentinfo").getByRole("link")).toHaveCount(3);
});
