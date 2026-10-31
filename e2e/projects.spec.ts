import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";
import { getProject, getProjects } from "../lib/projects";

// The suite runs against a production build, so read the content the way production does:
// drafts hidden. Expectations follow the MDX file, so replacing the placeholder copy keeps them true.
const slug = "meal-planner";
const project = getProject(slug, "production");
if (!project) throw new Error(`${slug} should be a published project`);
const { meta } = project;
const published = getProjects("production");

test.describe("project detail page", () => {
  test("opens with the title and the intro, with no facts line or hero above the write-up", async ({ page }) => {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);

    const title = page.getByRole("heading", { level: 1, name: meta.title });
    const intro = page.getByText(meta.intro);
    await expect(title).toBeVisible();
    await expect(intro).toBeVisible();

    const open = page.getByRole("link", { name: `Open ${meta.title}` });
    if (meta.url) {
      await expect(open).toHaveAttribute("href", meta.url);
      await expect(open).toHaveAttribute("target", "_blank");
    } else {
      await expect(open).toHaveCount(0);
    }

    // The cover is only the social preview, and role, year and status aren't shown.
    await expect(page.getByRole("img", { name: meta.title, exact: true })).toHaveCount(0);
    await expect(page.locator("main").getByText(meta.status, { exact: true })).toHaveCount(0);
    await expect(page.locator("main dl, main figcaption")).toHaveCount(0);

    // The first section heading follows the intro.
    const firstSection = page.locator("main .prose h2").first();
    const order = await page.evaluate(
      ([titleEl, introEl, sectionEl]) => {
        const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        return follows(titleEl, introEl) && follows(introEl, sectionEl);
      },
      [await title.elementHandle(), await intro.elementHandle(), await firstSection.elementHandle()],
    );
    expect(order).toBe(true);
  });

  test("shows the write-up's images one per row at the full media width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/projects/${slug}`);
    const images = page.locator("main .prose img");
    expect(await images.count()).toBeGreaterThan(0);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      expect((await image.boundingBox())!.width).toBeCloseTo(780, 0);
    }
  });

  test("explains how it was built, then links back to the projects", async ({ page }) => {
    await page.goto(`/projects/${slug}`);

    const section = page.getByRole("region", { name: "How I built it" });
    await expect(section.getByRole("heading", { level: 2, name: "How I built it" })).toBeVisible();
    await expect(section.getByText(meta.workflow)).toBeVisible();
    await expect(section.getByText(`Built with ${meta.stack.join(", ")}.`)).toBeVisible();

    const back = page.getByRole("link", { name: "Back to Projects" });
    await expect(back).toHaveAttribute("href", "/projects");
    await expect(back).toHaveText(/^←\s*Back to Projects$/);
  });

  test("shows a next-project link only when there is another published project", async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    const next = page.getByRole("link", { name: /^Next/ });
    if (published.length < 2) {
      await expect(next).toHaveCount(0);
    } else {
      const index = published.findIndex((p) => p.slug === slug);
      await expect(next).toHaveAttribute("href", `/projects/${published[(index + 1) % published.length].slug}`);
    }
  });

  test("an unknown slug and a draft both return 404", async ({ page }) => {
    expect((await page.goto("/projects/does-not-exist"))?.status()).toBe(404);
    expect((await page.goto("/projects/example-project"))?.status()).toBe(404);
  });

  test("has its own title and social preview image", async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    await expect(page).toHaveTitle(new RegExp(meta.title));
    const preview = meta.cover.endsWith(".mp4") ? meta.poster : meta.cover;
    expect(await page.locator('meta[property="og:image"]').getAttribute("content")).toContain(preview);
  });

  test("an image in a media grid opens larger, and Escape closes it", async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    const trigger = page.locator("main button:has(img)").first();
    const alt = await trigger.locator("img").getAttribute("alt");
    expect(alt).toBeTruthy();
    const copies = page.getByRole("img", { name: alt!, exact: true });
    await expect(copies).toHaveCount(1);

    await trigger.click();
    await expect(copies).toHaveCount(2);
    await expect(copies.last()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(copies).toHaveCount(1);
  });

  test("the enlarged image is a modal dialog that keeps and returns keyboard focus", async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    const trigger = page.locator("main button:has(img)").first();
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("clicking Back to Projects plays the navigate sound", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "sounds play only with a mouse or trackpad");

    const tones: { type: string; frequency: number }[] = [];
    await page.exposeFunction("__recordTone", (type: string, frequency: number) => tones.push({ type, frequency }));
    await page.addInitScript(() => {
      const start = OscillatorNode.prototype.start;
      OscillatorNode.prototype.start = function (...args: Parameters<typeof start>) {
        (window as unknown as { __recordTone: (t: string, f: number) => void }).__recordTone(this.type, this.frequency.value);
        return start.apply(this, args);
      };
    });

    await page.goto(`/projects/${slug}`);
    // Audio unlocks on the first pointer press; press on empty space first.
    await page.mouse.click(5, 5);
    await page.getByRole("link", { name: "Back to Projects" }).click();

    await expect.poll(() => tones.filter((t) => t.type === "triangle").map((t) => t.frequency)).toEqual([600, 900]);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`passes an accessibility check in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(`/projects/${slug}`);
      await expectAccessible(page);
    });
  }
});

test.describe("/projects overview", () => {
  test("lists the published projects in order, without drafts, under its own title", async ({ page }) => {
    const response = await page.goto("/projects");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/^Projects/);
    await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();

    const entries = page.getByRole("main").getByRole("listitem");
    await expect(entries).toHaveCount(published.length);
    for (const [i, entry] of published.entries()) {
      await expect(entries.nth(i).getByRole("link")).toHaveAttribute("href", `/projects/${entry.slug}`);
    }
    await expect(page.locator('main a[href="/projects/example-project"]')).toHaveCount(0);
  });

  test("shows the meal-planner entry as a text row, title then year then tagline, and opens it", async ({ page }) => {
    await page.goto("/projects");
    const entry = page.getByRole("main").getByRole("listitem").filter({ hasText: meta.title });
    const link = entry.getByRole("link", { name: meta.title, exact: true });
    await expect(link).toBeVisible();
    await expect(entry).toHaveText([meta.title, String(meta.year), meta.tagline].join(""));
    await expect(entry.getByText(String(meta.year), { exact: true })).toBeVisible();
    await expect(entry.getByText(meta.tagline, { exact: true })).toBeVisible();
    // Text only: no cover image, card heading or status badge.
    await expect(entry.locator("img")).toHaveCount(0);
    await expect(entry.getByRole("heading")).toHaveCount(0);
    await expect(entry.getByText(meta.status, { exact: true })).toHaveCount(0);

    await link.click();
    await expect(page).toHaveURL(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name: meta.title })).toBeVisible();
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`passes an accessibility check in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/projects");
      await expectAccessible(page);
    });
  }
});
