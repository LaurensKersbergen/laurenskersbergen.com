"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ProjectTags } from "@/components/project-tags";
import { ProjectScene } from "@/components/scenes";
import { ground } from "@/lib/ground";
import type { Card } from "@/lib/projects";

export type { Card };


/**
 * A project as a portrait card on its vivid ground: the scene hangs from the
 * top-right corner and plays while the pointer is over the card; the title, a line and the tags
 * sit bottom-left. `heading` is the title's level: h3 under the homepage's "Selected work", h2
 * where the cards sit straight under the page's h1 (Projects), so no level is skipped.
 */
export function ProjectCard({ project, heading: Heading = "h3" }: { project: Card; heading?: "h2" | "h3" }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card"
      draggable={false}
      style={{ "--ground": ground(project.color), "--hue-ink": `var(--ui-vivid-${project.color})` } as CSSProperties}
    >
      <div className="project-card__art" aria-hidden="true">
        <ProjectScene name={`${project.scene}-cover`} />
      </div>
      <div className="project-card__copy">
        <div>
          <Heading className="project-card__title">{project.title}</Heading>
          <p className="project-card__tagline">{project.tagline}</p>
        </div>
        <ProjectTags tags={project.tags.slice(0, 2)} size="sm" />
      </div>
    </Link>
  );
}
