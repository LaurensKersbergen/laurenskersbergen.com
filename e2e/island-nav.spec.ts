import { expect, test, type Page, type TestInfo } from "@playwright/test";

// The floating island menu: a disclosure in the top-right corner of every page. Only a press on its
// toggle (the panel's first row) opens it; the toggle reads "Menu" collapsed and "Close" open.
const island = (page: Page) => page.getByRole("navigation", { name: "Site" });
const toggle = (page: Page) => island(page).getByRole("button");
const menuLink = (page: Page, name: string) => island(page).getByRole("link", { name, exact: true });
const currentLink = (page: Page) => island(page).locator('a[aria-current="page"]');
const focusInsideList = (page: Page) => page.evaluate(() => Boolean(document.activeElement?.closest("nav[aria-label='Site'] ul")));

// The island marks itself ready once hydrated; before that the toggle has no handlers.
async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(island(page)).toHaveAttribute("data-ready", "");
}

async function press(page: Page, testInfo: TestInfo) {
  if (testInfo.project.name === "iphone") await toggle(page).tap();
  else await toggle(page).click();
}

async function expectOpen(page: Page) {
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
  await expect(toggle(page)).toHaveAccessibleName("Close");
}

async function expectClosed(page: Page) {
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  await expect(toggle(page)).toHaveAccessibleName("Menu");
}

test("the toggle reads Menu on every page, and the current section's link is marked as current", async ({ page }) => {
  await open(page, "/");
  await expectClosed(page);
  await expect(currentLink(page)).toHaveText("Home");

  await open(page, "/writing/hello-world");
  await expectClosed(page);
  await expect(currentLink(page)).toHaveText("Writing");

  await open(page, "/listening");
  await expectClosed(page);
  await expect(currentLink(page)).toHaveText("Listening");
});

test("pressing the toggle opens it, showing every link, and pressing it again closes it", async ({ page }, testInfo) => {
  await open(page, "/");
  await press(page, testInfo);
  await expectOpen(page);
  for (const name of ["Home", "Projects", "Writing", "About", "Listening"]) await expect(menuLink(page, name)).toBeVisible();

  await press(page, testInfo);
  await expectClosed(page);
});

test("a press outside closes it", async ({ page }, testInfo) => {
  await open(page, "/");
  await press(page, testInfo);
  await expectOpen(page);

  if (testInfo.project.name === "iphone") await page.touchscreen.tap(300, 40);
  else await page.mouse.click(1000, 40);
  await expectClosed(page);
});

test("following a link closes it and the new page's link becomes current", async ({ page }, testInfo) => {
  await open(page, "/");
  await press(page, testInfo);
  if (testInfo.project.name === "iphone") await menuLink(page, "Writing").tap();
  else await menuLink(page, "Writing").click();
  await expect(page).toHaveURL(/\/writing$/);
  await expectClosed(page);
  await expect(currentLink(page)).toHaveText("Writing");
});

test("a route change closes it and resets the toggle to Menu", async ({ page }, testInfo) => {
  await open(page, "/");
  await press(page, testInfo);
  await menuLink(page, "About").click();
  await expect(page).toHaveURL(/\/about$/);

  await press(page, testInfo);
  await expectOpen(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expectClosed(page);
  await expect(currentLink(page)).toHaveText("Home");
});

test.describe("keyboard", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard paths are checked on the desktop profile");

  test("the toggle is the first tab stop; Enter opens it and the links follow it in tab order", async ({ page }) => {
    await open(page, "/");
    await page.keyboard.press("Tab");
    await expect(toggle(page)).toBeFocused();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expectOpen(page);
    for (const name of ["Home", "Projects", "Writing", "About", "Listening"]) {
      await page.keyboard.press("Tab");
      await expect(menuLink(page, name)).toBeFocused();
    }
  });

  test("Enter on the Close toggle closes it, and focus stays on the toggle", async ({ page }) => {
    await open(page, "/");
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    await expectOpen(page);
    await page.keyboard.press("Enter");
    await expectClosed(page);
    await expect(toggle(page)).toBeFocused();
  });

  test("Escape closes it and returns focus to the toggle", async ({ page }) => {
    await open(page, "/");
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(menuLink(page, "Home")).toBeFocused();

    await page.keyboard.press("Escape");
    await expectClosed(page);
    await expect(toggle(page)).toBeFocused();
  });

  test("focus leaving the menu closes it", async ({ page }) => {
    await open(page, "/");
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(menuLink(page, "Home")).toBeFocused();

    // On past the last link, out of the menu into the page.
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    expect(await focusInsideList(page)).toBe(false);
    await expectClosed(page);
  });

  test("while collapsed, the hidden links can't be focused", async ({ page }) => {
    await open(page, "/");
    await toggle(page).focus();
    await page.keyboard.press("Tab");
    await expect(toggle(page)).not.toBeFocused();
    expect(await focusInsideList(page)).toBe(false);
    await expect(island(page).locator("ul")).toHaveAttribute("inert", "");
  });
});

test.describe("mouse and trackpad", () => {
  test.skip(({ isMobile }) => isMobile, "hover only applies to fine pointers");

  test("hovering does not open it", async ({ page }) => {
    await open(page, "/");
    await toggle(page).hover();
    await page.waitForTimeout(500);
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    // Still the collapsed pill, its links see-through (Playwright counts opacity 0 as visible).
    await expect(island(page)).toHaveCSS("width", "82px");
    await expect(island(page).getByRole("listitem").first()).toHaveCSS("opacity", "0");
  });
});

test("with reduced motion, opening still expands it and shows the links", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/");
  await press(page, testInfo);
  await expectOpen(page);
  for (const item of await island(page).getByRole("listitem").all()) {
    await expect(item).toHaveCSS("opacity", "1");
  }
  await expect(menuLink(page, "Projects")).toBeVisible();
});

test("on phones, scrolling down past 80px hides it and scrolling back up shows it; on desktop it stays", async ({ page }, testInfo) => {
  if (testInfo.project.name === "desktop") await page.setViewportSize({ width: 1280, height: 480 });
  await open(page, "/about");
  const scrollTo = (y: number) => page.evaluate((top) => window.scrollTo(0, top), y);

  await scrollTo(40);
  await scrollTo(300);
  if (testInfo.project.name === "iphone") {
    await expect(island(page)).toHaveCSS("opacity", "0");
    await expect(island(page)).toHaveCSS("pointer-events", "none");
  } else {
    await page.waitForTimeout(400);
    await expect(island(page)).toHaveCSS("opacity", "1");
  }

  // Back up by 80px (over the 60px it waits for) shows it again.
  await scrollTo(220);
  await expect(island(page)).toHaveCSS("opacity", "1");
  await expect(island(page)).toHaveCSS("pointer-events", "auto");
});

test("the collapsed toggle never covers a page title", async ({ page }) => {
  for (const path of ["/", "/projects", "/projects/meal-planner", "/writing", "/about"]) {
    await open(page, path);
    const title = (await page.locator("main h1").first().boundingBox())!;
    const bar = (await island(page).boundingBox())!;
    const overlaps = title.x < bar.x + bar.width && bar.x < title.x + title.width && title.y < bar.y + bar.height && bar.y < title.y + title.height;
    expect(overlaps, `${path}: the title overlaps the menu`).toBe(false);
  }
});

test("it sits in the top-right corner and opens downward", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const closed = (await island(page).boundingBox())!;
  expect(viewport.width - (closed.x + closed.width)).toBeLessThanOrEqual(40);
  expect(closed.y).toBeLessThanOrEqual(40);

  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
  // Let the springs settle before measuring the open panel.
  await page.waitForTimeout(900);
  const opened = (await island(page).boundingBox())!;
  expect(opened.y).toBeLessThanOrEqual(closed.y);
  expect(opened.y + opened.height).toBeGreaterThan(closed.y + closed.height + 100);
  expect(Math.abs(opened.x + opened.width - (closed.x + closed.width))).toBeLessThanOrEqual(5);
});
