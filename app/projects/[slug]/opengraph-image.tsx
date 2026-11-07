import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { getProject, getProjects } from "@/lib/projects";

export const alt = "A project by Laurens Kersbergen";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

/** A project's link preview: its title and its one line. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogImage({ title: project?.meta.title ?? "Projects", subtitle: project?.meta.tagline ?? "" });
}
