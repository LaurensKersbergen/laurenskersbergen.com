import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";
import { getProjects } from "../lib/projects";

const published = getProjects("production");

test.describe("a project page", () => {
  for (const [i, project] of published.entries()) {
    test(`${project.title}: title, tags and intro, then its scenes, then the projects either side`, async ({ page }) => {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(`${project.title} | Laurens Kersbergen`);

      await expect(page.getByRole("heading", { level: 1, name: project.title })).toBeVisible();
      const tags = page.getByRole("main").getByRole("list", { name: "Tags" }).first();
      for (const tag of project.tags) await expect(tags).toContainText(tag);
      await expect(page.getByText(project.intro)).toBeVisible();

      await expect(page.locator(".media-stack .ss-stage")).toHaveCount(3);

      const nav = page.getByRole("navigation", { name: "More projects" });
      const previous = published[(i - 1 + published.length) % published.length];
      const next = published[(i + 1) % published.length];
      await expect(nav.getByRole("link", { name: new RegExp(`Previous\\s*${previous.title}`) })).toHaveAttribute("href", `/projects/${previous.slug}`);
      await expect(nav.getByRole("link", { name: new RegExp(`Next\\s*${next.title}`) })).toHaveAttribute("href", `/projects/${next.slug}`);
    });
  }

  test("an unknown slug returns 404", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("passes an accessibility check", async ({ page }) => {
    await page.goto(`/projects/${published[0].slug}`);
    await expectAccessible(page);
  });
});

test.describe("the projects overview", () => {
  test("shows every project as a card, in order", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(published.length);
    for (const [i, project] of published.entries()) {
      await expect(cards.nth(i)).toHaveAttribute("href", `/projects/${project.slug}`);
    }
  });

  test("passes an accessibility check", async ({ page }) => {
    await page.goto("/projects");
    await expectAccessible(page);
  });
});
