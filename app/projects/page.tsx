import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, previewImage } from "@/lib/projects";

const description = "Side projects I designed and built, and how I built them.";

export function generateMetadata(): Metadata {
  const image = getProjects().map(previewImage).find(Boolean);
  return {
    title: "Projects",
    description,
    openGraph: {
      title: "Projects",
      description,
      url: "/projects",
      images: image ? [image] : undefined,
    },
  };
}

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="page-column">
      <h1 className="text-title my-6.5">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-(--muted)">No projects yet.</p>
      ) : (
        <ul className="text-row flex flex-col gap-4.5">
          {projects.map((project) => (
            // Text only: the title links to the project's page, then its year and tagline.
            <li key={project.slug} className="flex flex-col items-start">
              <Link href={`/projects/${project.slug}`} className="text-(--fg)">
                {project.title}
              </Link>
              <span className="text-(--muted) tabular-nums">{project.year}</span>
              <span className="text-(--muted)">{project.tagline}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
