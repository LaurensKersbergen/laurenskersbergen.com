import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getProjects } from "../lib/projects";

// The suite runs against a production build, so read the content the way production does:
// drafts hidden. Expectations follow the MDX files, so replacing the placeholder copy keeps them true.
const published = getProjects("production");
const mealPlanner = published.find((project) => project.slug === "meal-planner");
if (!mealPlanner) throw new Error("meal-planner should be a published project");
const draftSlug = "example-project";
if (published.some((project) => project.slug === draftSlug)) throw new Error(`${draftSlug} should be a draft`);

test("homepage renders and passes an accessibility check", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Laurens Kersbergen" })).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("homepage lists the published projects, each linking to its page, and links to all projects", async ({ page }) => {
  await page.goto("/");

  const section = page.getByRole("region", { name: "Projects" });
  await expect(section.getByRole("heading", { level: 2, name: "Projects" })).toBeVisible();

  const rows = section.getByRole("listitem");
  await expect(rows).toHaveCount(published.length);

  const row = rows.filter({ hasText: mealPlanner.title });
  await expect(row.getByRole("link")).toHaveAttribute("href", `/projects/${mealPlanner.slug}`);
  await expect(row.getByText(mealPlanner.title, { exact: true })).toBeVisible();
  await expect(row.getByText(mealPlanner.tagline, { exact: true })).toBeVisible();

  await expect(section.getByRole("link", { name: "All projects" })).toHaveAttribute("href", "/projects");
});

test("the sitemap lists the projects overview and each published project, never a draft", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();

  expect(xml).toContain("<loc>https://laurenskersbergen.com/projects</loc>");
  for (const project of published) {
    expect(xml).toContain(`<loc>https://laurenskersbergen.com/projects/${project.slug}</loc>`);
  }
  expect(xml).not.toContain(draftSlug);
});
