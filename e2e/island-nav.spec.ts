import { expect, test, type Page, type TestInfo } from "@playwright/test";

// The floating island menu (U3): a disclosure at the bottom centre of every page.
const island = (page: Page) => page.getByRole("navigation", { name: "Site" });
const pill = (page: Page) => island(page).getByRole("button");
const menuLink = (page: Page, name: string) => island(page).getByRole("link", { name, exact: true });
const focusInsideList = (page: Page) => page.evaluate(() => Boolean(document.activeElement?.closest("nav[aria-label='Site'] ul")));

// The island marks itself ready once hydrated; before that the pill has no handlers.
async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(island(page)).toHaveAttribute("data-ready", "");
}

async function press(page: Page, testInfo: TestInfo) {
  if (testInfo.project.name === "iphone") await pill(page).tap();
  else await pill(page).click();
}

test("the pill names the current section and marks its link as current", async ({ page }) => {
  await open(page, "/");
  await expect(pill(page)).toHaveAccessibleName("Home");

  await open(page, "/writing/hello-world");
  await expect(pill(page)).toHaveAccessibleName("Writing");
  await expect(island(page).locator('a[aria-current="page"]')).toHaveText("Writing");
});

test.describe("keyboard", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard paths are checked on the desktop profile");

  test("the pill is the tab stop after the page, and Enter opens it with the links next in tab order", async ({ page }) => {
    await open(page, "/");
    await page.locator("main a").last().focus();
    await page.keyboard.press("Tab");
    await expect(pill(page)).toBeFocused();
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(pill(page)).toHaveAttribute("aria-expanded", "true");
    for (const name of ["Home", "Projects", "Writing", "About"]) {
      await page.keyboard.press("Tab");
      await expect(menuLink(page, name)).toBeFocused();
    }
  });

  test("tabbing past the last menu link collapses it", async ({ page }) => {
    await open(page, "/");
    await pill(page).focus();
    await page.keyboard.press("Enter");
    await expect(menuLink(page, "Home")).toBeVisible();
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape collapses it and returns focus to the pill", async ({ page }) => {
    await open(page, "/");
    await pill(page).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(menuLink(page, "Home")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
    await expect(pill(page)).toBeFocused();
  });

  test("while collapsed, Tab moves past the pill without reaching a hidden link", async ({ page }) => {
    await open(page, "/");
    await pill(page).focus();
    await page.keyboard.press("Tab");
    await expect(pill(page)).not.toBeFocused();
    expect(await focusInsideList(page)).toBe(false);
  });
});

test.describe("mouse and trackpad", () => {
  test.skip(({ isMobile }) => isMobile, "hover only applies to fine pointers");

  test("hovering opens it and moving away collapses it after the delay", async ({ page }) => {
    await open(page, "/");
    await pill(page).hover();
    await expect(pill(page)).toHaveAttribute("aria-expanded", "true");

    await page.mouse.move(10, 10);
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking while hover-opened pins it open until Escape", async ({ page }) => {
    await open(page, "/");
    await pill(page).hover();
    await pill(page).click();
    await page.mouse.move(10, 10);
    await page.waitForTimeout(600);
    await expect(pill(page)).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking while hover-opened pins it open until an outside click", async ({ page }) => {
    await open(page, "/");
    await pill(page).hover();
    await pill(page).click();
    await page.mouse.move(10, 10);
    await page.waitForTimeout(600);
    await expect(pill(page)).toHaveAttribute("aria-expanded", "true");

    await page.mouse.click(10, 10);
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("touch", () => {
  test.skip(({ isMobile }) => !isMobile, "tap paths are checked on the iPhone profile");

  test("tapping opens it, tapping outside closes it, and tapping a link navigates", async ({ page }) => {
    await open(page, "/");
    await pill(page).tap();
    await expect(pill(page)).toHaveAttribute("aria-expanded", "true");

    await page.touchscreen.tap(20, 120);
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");

    await pill(page).tap();
    await menuLink(page, "Writing").tap();
    await expect(page).toHaveURL(/\/writing$/);
    await expect(pill(page)).toHaveAccessibleName("Writing");
    await expect(pill(page)).toHaveAttribute("aria-expanded", "false");
  });
});

test("with reduced motion, opening still expands it and shows the links", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/");
  await press(page, testInfo);
  await expect(pill(page)).toHaveAttribute("aria-expanded", "true");
  for (const item of await island(page).getByRole("listitem").all()) {
    await expect(item).toHaveCSS("opacity", "1");
  }
  await expect(menuLink(page, "Projects")).toBeVisible();
});

test("scrolled to the bottom, the last paragraph stays clear of the pill", async ({ page }, testInfo) => {
  // A short window makes the page scroll on desktop as well.
  if (testInfo.project.name === "desktop") await page.setViewportSize({ width: 1280, height: 480 });
  await open(page, "/about");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  const last = await page.locator("main p").last().boundingBox();
  const bar = await pill(page).boundingBox();
  expect(last && bar).toBeTruthy();
  expect(last!.y + last!.height).toBeLessThanOrEqual(bar!.y);
});
