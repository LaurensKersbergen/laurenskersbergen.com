import { describe, it, expect } from "vitest";
import {
  filterDrafts,
  getProject,
  getProjects,
  pickNextProject,
  pickPreviousProject,
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
    period: "2026",
    tags: [],
    color: "gray",
    scene: overrides.slug,
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
  it("lists every project in its order", () => {
    expect(slugs(getProjects("production"))).toEqual(["miro", "meal-planner", "this-site", "growth-tribe", "kpn"]);
  });

  it("reads tags, a vivid colour, a period and the body", () => {
    const result = getProject("miro", "production");
    expect(result?.meta.tags).toContain("Databases");
    expect(result?.meta.color).toBe("yellow");
    expect(result?.meta.period).toBe("Since 2022");
    expect(result?.content).toContain("<Scene");
  });

  it("returns nothing for a missing slug", () => {
    expect(getProject("does-not-exist", "development")).toBeNull();
  });
});

describe("pickPreviousProject", () => {
  const projects = [project({ slug: "a" }), project({ slug: "b" }), project({ slug: "c" })];

  it("returns the project before", () => {
    expect(pickPreviousProject(projects, "b")?.slug).toBe("a");
  });

  it("wraps from the first project to the last", () => {
    expect(pickPreviousProject(projects, "a")?.slug).toBe("c");
  });

  it("returns null when there is no other project", () => {
    expect(pickPreviousProject([project({ slug: "a" })], "a")).toBeNull();
  });
});
