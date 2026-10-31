import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export interface ProjectMeta {
  title: string;
  /** One line, for lists. */
  tagline: string;
  /** Two or three sentences, for the detail page. */
  intro: string;
  role: string;
  year: number;
  /** For example "Live" or "In progress". */
  status: string;
  logo: string;
  /** Image or MP4 path under /projects/<slug>/. */
  cover: string;
  /** Tools used, for "How I built it". */
  stack: string[];
  /** A short paragraph on the agentic way it was built. */
  workflow: string;
  /** Still image for a video cover. */
  poster?: string;
  url?: string;
  order?: number;
  draft?: boolean;
  slug: string;
}

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

/** The still that stands for the project: the cover, or its poster when the cover is a video. */
export function previewImage(meta: ProjectMeta) {
  return meta.cover.endsWith(".mp4") ? meta.poster : meta.cover;
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
      status: data.status ?? "",
      logo: data.logo ?? "",
      cover: data.cover ?? "",
      stack: data.stack ?? [],
      workflow: data.workflow ?? "",
      poster: data.poster,
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
    .filter((file) => file.endsWith(".mdx"))
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

export function getNextProject(
  slug: string,
  env: string | undefined = process.env.NODE_ENV
): ProjectMeta | null {
  return pickNextProject(getProjects(env), slug);
}
