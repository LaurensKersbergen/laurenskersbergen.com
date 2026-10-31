import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Media } from "@kit/ui";
import { mediaBlock, projectMdxComponents } from "@/components/project-mdx";
import { getNextProject, getProject, getProjects, previewImage } from "@/lib/projects";

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
  const image = previewImage(meta);
  return {
    title: meta.title,
    description: meta.tagline,
    openGraph: {
      title: meta.title,
      description: meta.tagline,
      url: `/projects/${slug}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;
  const next = getNextProject(slug);
  const facts = [meta.role, meta.year, meta.status, meta.stack.length > 0 ? `Built with ${meta.stack.join(", ")}` : null].filter(Boolean);

  return (
    <article className="page-column">
      <header>
        <h1 className="text-title my-6.5">{meta.title}</h1>
        <p className="mb-7 text-(--fg)">{meta.intro}</p>
        <p className="mb-7 text-(--muted)">
          {facts.join(" · ")}
          {meta.url ? (
            <>
              {" · "}
              <a href={meta.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                Visit<span aria-hidden="true"> ↗</span>
              </a>
            </>
          ) : null}
        </p>
      </header>

      <Media
        src={meta.cover}
        poster={meta.poster}
        alt={meta.title}
        priority
        sizes="(min-width: 828px) 780px, 100vw"
        className={mediaBlock}
      />

      <div className="prose">
        <MDXRemote source={content} components={projectMdxComponents} />
      </div>

      <section aria-labelledby="how-i-built-it" className="prose">
        <h2 id="how-i-built-it">How I built it</h2>
        <p>{meta.workflow}</p>
        <ul className="list-none pl-0 text-(--muted)">
          {meta.stack.map((tool) => (
            <li key={tool} className="mb-0">
              {tool}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Projects" className="mt-9.25 flex items-center justify-between gap-6 font-semibold">
        <Link href="/projects" className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">←</span>
          Back to Projects
        </Link>
        {next ? (
          <Link href={`/projects/${next.slug}`} className="inline-flex items-center gap-1.5">
            Next<span className="sr-only"> project: {next.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
