import { getPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().map((post) => ({
    url: `https://laurenskersbergen.com/writing/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const projects = getProjects().map((project) => ({
    url: `https://laurenskersbergen.com/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const routes = ["", "/about", "/writing", "/projects"].map((route) => ({
    url: `https://laurenskersbergen.com${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...posts, ...projects];
}
