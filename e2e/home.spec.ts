import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";
import { getProjects } from "../lib/projects";
import { timeline } from "../lib/timeline";

// The suite runs against a production build, so read the content the way production does.
const published = getProjects("production");

test("homepage renders and passes an accessibility check", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Laurens Kersbergen, product manager in Amsterdam.");

  await expectAccessible(page);
});

test("the intro names Miro and KPN, each linking out", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByRole("heading", { level: 1 });
  await expect(intro.getByRole("link", { name: "Miro" })).toHaveAttribute("href", "https://miro.com/");
  await expect(intro.getByRole("link", { name: "KPN" })).toHaveAttribute("href", "https://www.kpn.com/");
});

test("the carousel shows every project in order, each card opening its page", async ({ page }) => {
  await page.goto("/");
  const work = page.getByRole("region", { name: "Selected work" });
  const cards = work.locator(".project-card");
  await expect(cards).toHaveCount(published.length);
  for (const [i, project] of published.entries()) {
    await expect(cards.nth(i)).toHaveAttribute("href", `/projects/${project.slug}`);
    await expect(cards.nth(i).getByRole("heading", { level: 3 })).toHaveText(project.title);
  }

  await cards.first().click();
  await expect(page).toHaveURL(`/projects/${published[0].slug}`);
});

test("the carousel's arrows step through it, the first one disabled at the start", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "iphone", "Phones swipe; the arrows are hidden");
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous projects" });
  const next = page.getByRole("button", { name: "Next projects" });
  await expect(previous).toBeDisabled();

  const track = page.locator(".carousel__track");
  await next.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await expect(previous).toBeEnabled();
});

test("the timeline lists the last five years, each role with its period", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "The last five years" });
  const rows = section.locator(".timeline__row");
  await expect(rows).toHaveCount(timeline.length);
  for (const [i, entry] of timeline.entries()) {
    await expect(rows.nth(i)).toContainText(entry.name);
    await expect(rows.nth(i)).toContainText(entry.role);
    await expect(rows.nth(i)).toContainText(entry.label);
  }
});

test("the footer links to X, GitHub and email, with this year's copyright", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "@lvkersbergen" })).toHaveAttribute("href", "https://x.com/lvkersbergen");
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/LaurensKersbergen");
  await expect(footer.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:hey@laurenskersbergen.com");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Laurens Kersbergen`);
});

test("the sitemap lists the projects overview and each published project", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();

  expect(xml).toContain("<loc>https://laurenskersbergen.com/projects</loc>");
  for (const project of published) {
    expect(xml).toContain(`<loc>https://laurenskersbergen.com/projects/${project.slug}</loc>`);
  }
});
