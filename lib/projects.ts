import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { vividHues, type VividHue } from "@/kit/ui/vivid";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export interface ProjectMeta {
  title: string;
  /** One line, for the card and the social preview. */
  tagline: string;
  /** A short paragraph beside the title on the detail page. */
  intro: string;
  /** What Laurens did, as a tag ("Product management"). */
  role: string;
  /** For sorting: the year the work started, or the year it shipped. */
  year: number;
  /** The time it covers as words, shown as a tag: "2026", "Since 2022", "2021 to 2022". */
  period: string;
  /** Words about the work, each a vivid tag that takes its colour from its name. */
  tags: string[];
  /** The vivid hue of the card and media grounds. */
  color: VividHue;
  /** The Stageshow scenes for this project: components/scenes/<scene>.tsx. */
  scene: string;
  url?: string;
  order?: number;
  draft?: boolean;
  slug: string;
}

/** What a project card shows. */
export type Card = Pick<ProjectMeta, "slug" | "title" | "tagline" | "tags" | "period" | "color" | "scene">;

/** The fields a card needs, so a page hands no more than that to the client. */
export const toCard = ({ slug, title, tagline, tags, period, color, scene }: ProjectMeta): Card => ({ slug, title, tagline, tags, period, color, scene });

/** By `order` ascending; projects without `order` follow, newest `year` first. */
export function sortProjects(projects: ProjectMeta[]): ProjectMeta[] {
  return [...projects].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return b.year - a.year;
  });
}

/** Drafts are hidden when `env` is "production" and shown otherwise. */
export function filterDrafts(
  projects: ProjectMeta[],
  env: string | undefined
): ProjectMeta[] {
  return env === "production" ? projects.filter((p) => !p.draft) : projects;
}

/** The project after `slug`, wrapping to the first; null when there is no other project. */
export function pickNextProject(
  projects: ProjectMeta[],
  slug: string
): ProjectMeta | null {
  if (projects.length < 2) return null;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return projects[(index + 1) % projects.length];
}

/** The project before `slug`, wrapping to the last; null when there is no other project. */
export function pickPreviousProject(
  projects: ProjectMeta[],
  slug: string
): ProjectMeta | null {
  if (projects.length < 2) return null;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return projects[(index - 1 + projects.length) % projects.length];
}

function asHue(value: unknown): VividHue {
  return vividHues.includes(value as VividHue) ? (value as VividHue) : "gray";
}

function readProjectFile(
  slug: string
): { meta: ProjectMeta; content: string } | null {
  const filePath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));

  return {
    meta: {
      title: data.title ?? slug,
      tagline: data.tagline ?? "",
      intro: data.intro ?? "",
      role: data.role ?? "",
      year: Number(data.year ?? 0),
      period: String(data.period ?? data.year ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      color: asHue(data.color),
      scene: data.scene ?? slug,
      url: data.url,
      order: data.order,
      draft: data.draft === true,
      slug,
    },
    content,
  };
}

export function getProjects(
  env: string | undefined = process.env.NODE_ENV
): ProjectMeta[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const projects = fs
    .readdirSync(projectsDirectory)
    // iCloud saves conflicting copies as "name 2.mdx"; a file name with a space is never a project.
    .filter((file) => file.endsWith(".mdx") && !/\s/.test(file))
    .map((file) => readProjectFile(file.replace(/\.mdx$/, "")))
    .filter((project) => project !== null)
    .map((project) => project.meta);

  return sortProjects(filterDrafts(projects, env));
}

/** Null for a missing file, or a draft in production, so the page can call notFound(). */
export function getProject(
  slug: string,
  env: string | undefined = process.env.NODE_ENV
): { meta: ProjectMeta; content: string } | null {
  const project = readProjectFile(slug);
  if (!project || filterDrafts([project.meta], env).length === 0) {
    return null;
  }
  return project;
}

/** The projects either side of `slug`, for the links at the foot of its page. */
export function getNeighbours(
  slug: string,
  env: string | undefined = process.env.NODE_ENV
): { previous: ProjectMeta | null; next: ProjectMeta | null } {
  const projects = getProjects(env);
  return { previous: pickPreviousProject(projects, slug), next: pickNextProject(projects, slug) };
}
