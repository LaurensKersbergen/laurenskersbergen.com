import { expect, test } from "@playwright/test";

const names = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName).filter(Boolean));

test("the intro's words hold still while the logos open their slots and bloom in", async ({ page }) => {
  await page.goto("/");
  const running = await names(page);
  // Where opening a slot would push a word onto another line (on phones), the slots start open
  // (data-intro-held) and only the logos bloom.
  const held = await page.evaluate(() => document.documentElement.hasAttribute("data-intro-held"));
  if (held) expect(running).not.toContain("intro-slot-open");
  else expect(running).toContain("intro-slot-open");
  expect(running).toContain("intro-slot-in");
});

test("blocks below the fold wait for the scroll, then come in", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto("/");
  const timeline = page.locator(".timeline");
  await expect(timeline).not.toHaveAttribute("data-in", "");
  await timeline.scrollIntoViewIfNeeded();
  await expect(timeline).toHaveAttribute("data-in", "");
});

test("with reduced motion, nothing animates in and nothing waits hidden", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await names(page)).not.toContain("intro-slot-open");
  const opacity = await page.locator(".timeline").evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});
