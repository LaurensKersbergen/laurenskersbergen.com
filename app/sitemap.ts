import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

/**
 * Every page, on www (where the site lives). A post's lastModified is its date; pages without a
 * real date of change leave it out rather than claim one every build, which search engines learn
 * to ignore.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/writing", "/about", "/listening"].map((path) => ({ url: `${siteUrl}${path}` }));

  const projects = getProjects().map((project) => ({ url: `${siteUrl}/projects/${project.slug}` }));

  const posts = getPosts().map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    ...(post.date ? { lastModified: new Date(post.date) } : {}),
  }));

  return [...pages, ...projects, ...posts];
}
