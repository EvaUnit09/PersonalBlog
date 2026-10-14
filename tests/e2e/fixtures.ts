import { expect as baseExpect, test as base, type Locator } from "@playwright/test";
import { BOOT_SEEN, BOOT_STORAGE_KEY } from "../../lib/boot";

export { expect } from "@playwright/test";

export async function expectNewTab(link: Locator) {
  await baseExpect(link).toHaveAttribute("target", "_blank");
  await baseExpect(link).toHaveAttribute("rel", "noopener noreferrer");
}

/** Every spec except motion.spec.ts runs as a returning visitor, so the boot overlay never covers the page. */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(
      ([key, value]) => sessionStorage.setItem(key, value),
      [BOOT_STORAGE_KEY, BOOT_SEEN] as const,
    );
    await provide(page);
  },
});
