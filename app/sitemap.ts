import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

/**
 * Every page, on www (where the site lives). None has a real date of change, so lastModified is
 * left out rather than claimed every build, which search engines learn to ignore.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/listening"].map((path) => ({ url: `${siteUrl}${path}` }));

  const projects = getProjects().map((project) => ({ url: `${siteUrl}/projects/${project.slug}` }));

  return [...pages, ...projects];
}
