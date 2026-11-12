import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@kit/ui";
import { ProjectTags } from "@/components/project-tags";
import { projectMdxComponents } from "@/components/project-mdx";
import { ProjectScene } from "@/components/scenes";
import { ground } from "@/lib/ground";
import { getNeighbours, getProject, getProjects, type ProjectMeta } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const { meta } = project;
  return pageMetadata({ title: meta.title, description: meta.intro || meta.tagline, path: `/projects/${slug}`, image: `/projects/${slug}/opengraph-image` });
}

const groundStyle = (meta: Pick<ProjectMeta, "color">) => ({ "--ground": ground(meta.color) }) as CSSProperties;

/*
 * A project page on white: the title with its tags (the kit's Tag in the vivid hues)
 * on the left and the intro on the right; then the media, full width or two up, each a Stageshow
 * scene on the project's own ground; then the projects either side, each with a thumbnail.
 */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;
  const { previous, next } = getNeighbours(slug);

  return (
    <article className="page-top">
      <header className="shell">
        <div className="project-header">
          <div className="project-lead" data-reveal>
            <h1 className="display-xl">{meta.title}</h1>
            <ProjectTags tags={meta.tags} size="lg" />
          </div>
          <div data-reveal style={{ "--reveal-delay": "120ms" } as CSSProperties}>
            <p className="intro-text">{meta.intro}</p>
            {meta.url ? (
              <a href={meta.url} target="_blank" rel="noopener noreferrer" className="pill project-visit">
                Visit {new URL(meta.url).hostname.replace(/^www\./, "")}
                <ArrowUpRightIcon size={14} className="pill__icon" />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="shell media-stack" style={groundStyle(meta)}>
        <MDXRemote source={content} components={projectMdxComponents} />
      </div>

      {previous && next ? (
        <nav aria-label="More projects" className="shell">
          <div className="project-nav" data-reveal>
            <Neighbour project={previous} side="previous" />
            <Neighbour project={next} side="next" />
          </div>
        </nav>
      ) : null}
    </article>
  );
}

function Neighbour({ project, side }: { project: ProjectMeta; side: "previous" | "next" }) {
  const Arrow = side === "previous" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <Link href={`/projects/${project.slug}`} className={side === "next" ? "pn-side pn-side--next" : "pn-side"}>
      <Arrow size={28} strokeWidth={1.5} className="pn-arrow" />
      <span className="pn-thumb" style={groundStyle(project)} aria-hidden="true">
        <ProjectScene name={`${project.scene}-cover`} still />
      </span>
      <span className="pn-col">
        <span className="label">{side === "previous" ? "Previous" : "Next"}</span>
        <span className="pn-name">{project.title}</span>
      </span>
    </Link>
  );
}
