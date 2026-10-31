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

test("homepage shows the portrait next to the intro, with links to a project, About and Email", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Laurens Kersbergen" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Laurens Kersbergen", exact: true })).toBeVisible();

  const mealPlannerLink = page.getByRole("link", { name: "just shipped a hyper-personalized meal planning app" });
  await expect(mealPlannerLink).toHaveAttribute("href", `/projects/${mealPlanner.slug}`);

  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "About", exact: true })).toHaveAttribute("href", "/about");
  await expect(main.getByRole("link", { name: "Email", exact: true })).toHaveAttribute("href", "mailto:hey@laurenskersbergen.com");

  // The homepage no longer lists the projects: they live on /projects, reached from the menu.
  await expect(page.getByRole("region", { name: "Projects" })).toHaveCount(0);
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
