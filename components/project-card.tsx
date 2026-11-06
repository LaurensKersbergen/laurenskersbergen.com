"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRightIcon } from "@kit/ui";
import { ProjectTags } from "@/components/project-tags";
import { ProjectScene } from "@/components/scenes";
import type { Card } from "@/lib/projects";

export type { Card };


/**
 * A project as a portrait card on its vivid ground: the scene hangs from the
 * top-right corner and plays while the pointer is over the card; the title, a line and the tags
 * sit bottom-left; an arrow comes in at the top-left to say it opens.
 */
export function ProjectCard({ project }: { project: Card }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card"
      draggable={false}
      style={{ "--ground": `var(--ui-vivid-${project.color}-subtle)`, "--hue-ink": `var(--ui-vivid-${project.color})` } as CSSProperties}
    >
      <div className="project-card__art" aria-hidden="true">
        <ProjectScene name={`${project.scene}-cover`} />
      </div>
      <span className="project-card__open" aria-hidden="true">
        <ArrowUpRightIcon size={16} strokeWidth={2} />
      </span>
      <div className="project-card__copy">
        <div>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__tagline">{project.tagline}</p>
        </div>
        <ProjectTags tags={project.tags.slice(0, 2)} period={project.period} size="sm" />
      </div>
    </Link>
  );
}
