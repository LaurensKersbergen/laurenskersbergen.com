import { getPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().map((post) => ({
    url: `https://laurenskersbergen.com/writing/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const routes = ["", "/about", "/writing"].map((route) => ({
    url: `https://laurenskersbergen.com${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...posts];
}
