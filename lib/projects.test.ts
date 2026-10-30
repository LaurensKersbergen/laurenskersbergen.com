import { describe, it, expect } from "vitest";
import {
  filterDrafts,
  getProject,
  getProjects,
  pickNextProject,
  sortProjects,
  type ProjectMeta,
} from "./projects";

function project(overrides: Partial<ProjectMeta> & { slug: string }): ProjectMeta {
  return {
    title: overrides.slug,
    tagline: "",
    intro: "",
    role: "",
    year: 2026,
    status: "Live",
    logo: "",
    cover: "",
    stack: [],
    workflow: "",
    ...overrides,
  };
}

const slugs = (projects: ProjectMeta[]) => projects.map((p) => p.slug);

describe("sortProjects", () => {
  it("puts order 1 before order 2 regardless of year", () => {
    const sorted = sortProjects([
      project({ slug: "second", order: 2, year: 2026 }),
      project({ slug: "first", order: 1, year: 2020 }),
    ]);
    expect(slugs(sorted)).toEqual(["first", "second"]);
  });

  it("puts projects without order after ordered ones, newest year first", () => {
    const sorted = sortProjects([
      project({ slug: "old", year: 2021 }),
      project({ slug: "ordered", order: 1, year: 2019 }),
      project({ slug: "new", year: 2025 }),
    ]);
    expect(slugs(sorted)).toEqual(["ordered", "new", "old"]);
  });
});

describe("filterDrafts", () => {
  const projects = [
    project({ slug: "published" }),
    project({ slug: "wip", draft: true }),
  ];

  it("excludes drafts in production", () => {
    expect(slugs(filterDrafts(projects, "production"))).toEqual(["published"]);
  });

  it("includes drafts outside production", () => {
    expect(slugs(filterDrafts(projects, "development"))).toEqual([
      "published",
      "wip",
    ]);
  });
});

describe("pickNextProject", () => {
  const projects = [
    project({ slug: "a" }),
    project({ slug: "b" }),
    project({ slug: "c" }),
  ];

  it("returns the following project", () => {
    expect(pickNextProject(projects, "a")?.slug).toBe("b");
  });

  it("wraps from the last project to the first", () => {
    expect(pickNextProject(projects, "c")?.slug).toBe("a");
  });

  it("returns nothing when there is only one project", () => {
    expect(pickNextProject([project({ slug: "solo" })], "solo")).toBeNull();
  });
});

describe("content/projects files", () => {
  it("lists meal-planner but not the example draft in production", () => {
    const projects = getProjects("production");
    expect(slugs(projects)).toContain("meal-planner");
    expect(slugs(projects)).not.toContain("example-project");
  });

  it("lists the example draft outside production", () => {
    const projects = getProjects("development");
    expect(slugs(projects)).toEqual(["meal-planner", "example-project"]);
    const meal = projects[0];
    expect(meal.order).toBe(1);
    expect(meal.stack.length).toBeGreaterThan(0);
    expect(meal.draft).toBeFalsy();
  });

  it("returns nothing when reading a draft in production", () => {
    expect(getProject("example-project", "production")).toBeNull();
  });

  it("reads a draft with its content outside production", () => {
    const result = getProject("example-project", "development");
    expect(result?.meta.draft).toBe(true);
    expect(result?.meta.poster).toBe("/projects/example-project/poster.png");
    expect(result?.content).toContain("<Embed");
  });

  it("returns nothing for a missing slug", () => {
    expect(getProject("does-not-exist", "development")).toBeNull();
  });
});
