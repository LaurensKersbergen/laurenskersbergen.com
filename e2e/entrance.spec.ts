import { expect, test, type Locator } from "@playwright/test";
import { waitForEntrance } from "./helpers";

// The page's entrance (.enter in globals.css): each block eases in after the one above it.
// Read from computed styles, so the checks hold however far the animation has run.
const entrance = (block: Locator) =>
  block.evaluate((element) => {
    const style = getComputedStyle(element);
    const delay = style.animationDelay;
    return { name: style.animationName, delay: Number.parseFloat(delay) * (delay.endsWith("ms") ? 1 : 1000) };
  });

async function delays(blocks: Locator[]) {
  const timings = await Promise.all(blocks.map(entrance));
  for (const timing of timings) expect(timing.name).toBe("enter");
  return timings.map((timing) => timing.delay);
}

const isAscending = (values: number[]) => values.every((value, i) => i === 0 || value > values[i - 1]);

test("the homepage's portrait, name and paragraphs ease in one after another, top to bottom", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");
  const blocks = [main.getByRole("img", { name: "Laurens Kersbergen", exact: true }), main.getByRole("heading", { level: 1 }), ...(await main.locator("p").all())];
  const timings = await delays(blocks);
  expect(timings[0]).toBe(0);
  expect(isAscending(timings)).toBe(true);
  // Everything is in place within about a second.
  expect(Math.max(...timings)).toBeLessThanOrEqual(500);
});

test("a project page eases in from the title down, with the links back and on last", async ({ page }) => {
  await page.goto("/projects/meal-planner");
  const main = page.getByRole("main");
  const title = main.getByRole("heading", { level: 1 });
  const firstSection = main.locator(".prose h2").first();
  const nav = main.getByRole("navigation", { name: "Projects" });
  const timings = await delays([title, firstSection, nav]);
  expect(isAscending(timings)).toBe(true);
});

test("following a link plays it again on the new page", async ({ page }) => {
  await page.goto("/");
  await waitForEntrance(page);
  // The document outlives a client-side navigation, so a listener on it sees the new page start.
  await page.evaluate(() => {
    const started: string[] = [];
    (window as unknown as { entered: string[] }).entered = started;
    document.addEventListener("animationstart", (event) => {
      if (event.animationName === "enter") started.push((event.target as Element).tagName);
    });
  });
  await page.getByRole("link", { name: "just shipped a hyper-personalized meal planning app" }).click();
  await expect(page).toHaveURL(/\/projects\/meal-planner$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { entered: string[] }).entered)).toContain("H1");
});

test("an enlarged image opens without it", async ({ page }) => {
  await page.goto("/about");
  await waitForEntrance(page);
  await page.locator("main button:has(img)").first().click();
  const { name } = await entrance(page.getByRole("dialog"));
  expect(name).toBe("none");
});

test("with reduced motion nothing animates in", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const heading = page.getByRole("main").getByRole("heading", { level: 1 });
  expect((await entrance(heading)).name).toBe("none");
  await expect(heading).toHaveCSS("opacity", "1");
});
