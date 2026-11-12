import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Scrolls through the page so every block revealed on scroll (data-reveal) has come in, then
 * waits until every finite animation and transition has finished, back at the top.
 */
export async function waitForEntrance(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

/**
 * Runs axe at WCAG 2.2 AA. Contrast is measured on what's painted, so the entrance finishes first,
 * and then the project scenes are held still: they loop, crossfading chips and labels, and a text
 * caught halfway through a fade measures a contrast it never has at rest. Under reduced motion each
 * Stageshow stage shows its still frame (components/stageshow/kit/reduced-motion.ts).
 */
export async function expectAccessible(page: Page) {
  await waitForEntrance(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
}
