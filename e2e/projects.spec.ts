import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getProject, getProjects } from "../lib/projects";

// The suite runs against a production build, so read the content the way production does:
// drafts hidden. Expectations follow the MDX file, so replacing the placeholder copy keeps them true.
const slug = "meal-planner";
const project = getProject(slug, "production");
if (!project) throw new Error(`${slug} should be a published project`);
const { meta } = project;
const published = getProjects("production");

test.describe("project detail page", () => {
  test("opens with the title, then the intro, the facts and the hero", async ({ page }) => {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);

    const title = page.getByRole("heading", { level: 1, name: meta.title });
    const intro = page.getByText(meta.intro);
    const facts = page.locator("dl");
    const hero = page.getByRole("img", { name: meta.title, exact: true });
    await expect(title).toBeVisible();
    await expect(intro).toBeVisible();
    await expect(hero).toBeVisible();

    await expect(facts.getByRole("term")).toHaveText(meta.url ? ["Role", "Year", "Status", "Built with", "Live"] : ["Role", "Year", "Status", "Built with"]);
    await expect(facts.getByRole("definition").first()).toHaveText(meta.role);
    await expect(facts.getByRole("definition").nth(1)).toHaveText(String(meta.year));
    await expect(facts.getByRole("definition").nth(2)).toHaveText(meta.status);
    if (meta.url) {
      const live = facts.getByRole("link");
      await expect(live).toHaveAttribute("href", meta.url);
      await expect(live).toHaveAttribute("target", "_blank");
    } else {
      await expect(facts.getByRole("link")).toHaveCount(0);
    }

    // Document order: h1, intro, facts, hero.
    const order = await page.evaluate(
      ([titleEl, introEl, factsEl, heroEl]) => {
        const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        return follows(titleEl, introEl) && follows(introEl, factsEl) && follows(factsEl, heroEl);
      },
      [await title.elementHandle(), await intro.elementHandle(), await facts.elementHandle(), await hero.elementHandle()],
    );
    expect(order).toBe(true);
  });

  test("explains how it was built, then links back to all projects", async ({ page }) => {
    await page.goto(`/projects/${slug}`);

    const section = page.getByRole("region", { name: "How I built it" });
    await expect(section.getByRole("heading", { level: 2, name: "How I built it" })).toBeVisible();
    await expect(section.getByText(meta.workflow)).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveText(meta.stack);

    const back = page.getByRole("link", { name: "All projects" });
    await expect(back).toHaveAttribute("href", "/projects");
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

  test("clicking All projects plays the navigate sound", async ({ page }, testInfo) => {
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
    await page.getByRole("link", { name: "All projects" }).click();

    await expect.poll(() => tones.filter((t) => t.type === "triangle").map((t) => t.frequency)).toEqual([600, 900]);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`passes an accessibility check in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(`/projects/${slug}`);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations).toEqual([]);
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

  test("shows the meal-planner entry with its status and year, and opens it", async ({ page }) => {
    await page.goto("/projects");
    const entry = page.getByRole("main").getByRole("listitem").filter({ has: page.getByRole("heading", { name: meta.title }) });
    await expect(entry.getByRole("heading", { level: 2, name: meta.title })).toBeVisible();
    await expect(entry.getByText(meta.tagline)).toBeVisible();
    await expect(entry.getByText(meta.status, { exact: true })).toBeVisible();
    await expect(entry.getByText(String(meta.year), { exact: true })).toBeVisible();
    await expect(entry.locator("img")).toBeVisible();

    await entry.getByRole("link").click();
    await expect(page).toHaveURL(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name: meta.title })).toBeVisible();
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`passes an accessibility check in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/projects");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
