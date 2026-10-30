import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The pages that existed before the starter kit's theme came in: they still load and pass axe in both schemes.
const pages = ["/", "/about", "/writing", "/listening"];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({ colorScheme });

    for (const path of pages) {
      test(`${path} renders and passes an accessibility check`, async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);

        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}
