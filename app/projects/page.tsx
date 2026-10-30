import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge, Card, EmptyState, MetaList } from "@kit/ui";
import { getProjects, previewImage, statusTone } from "@/lib/projects";

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
    <div>
      <h1 className="text-xl md:text-2xl font-medium mb-8" style={{ lineHeight: "3.25rem" }}>
        Projects
      </h1>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet." />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-8 p-0">
          {projects.map((project, i) => {
            const image = previewImage(project);
            return (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="group block rounded-card no-underline!">
                  <Card className="overflow-hidden p-0 transition-colors group-hover:border-line-2">
                    <div className="relative aspect-3/2 border-b border-line bg-fill">
                      {image ? (
                        <Image
                          src={image}
                          alt=""
                          fill
                          priority={i === 0}
                          sizes="(min-width: 650px) 586px, calc(100vw - 4rem)"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="px-5 pt-4 pb-5">
                      <h2 className="m-0 font-medium text-ink underline-offset-4 group-hover:underline">{project.title}</h2>
                      <p className="mt-1 mb-0 text-control text-ink-2">{project.tagline}</p>
                      <MetaList
                        items={[<Badge key="status" tone={statusTone(project.status)}>{project.status}</Badge>, project.year]}
                        className="mt-3 text-control text-ink-2 tabular-nums"
                      />
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
