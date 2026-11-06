import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Waits until every block on the page has finished easing in (.enter in globals.css). */
export async function waitForEntrance(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => (animation as CSSAnimation).animationName === "enter")
        .map((animation) => animation.finished),
    ),
  );
}

/** Runs axe at WCAG 2.2 AA. Contrast is measured on what's painted, so the entrance finishes first. */
export async function expectAccessible(page: Page) {
  await waitForEntrance(page);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
}
