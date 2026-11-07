import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { CSSProperties } from "react";
import { ProjectCard } from "@/components/project-card";
import { getProjects, toCard } from "@/lib/projects";

const description = "Work by Laurens Kersbergen at Miro, Growth Tribe and KPN, and the side projects along the way.";

export const metadata: Metadata = pageMetadata({ title: "Projects", description, path: "/projects" });

/** Every project as the homepage's cards, in a grid: three across, two on tablets, one on phones. */
export default function ProjectsPage() {
  const projects = getProjects().map(toCard);

  return (
    <div className="page-top shell">
      <div className="project-header" data-reveal>
        <h1 className="display-xl">Projects</h1>
        <p className="intro-text">{description}</p>
      </div>
      <ul className="-mt-[10px] grid grid-cols-3 gap-4 max-[62rem]:grid-cols-2 max-md:-mt-[8px] max-md:grid-cols-1">
        {projects.map((project, i) => (
          <li key={project.slug} data-reveal style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as CSSProperties}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
