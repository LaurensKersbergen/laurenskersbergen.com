import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { projectMdxComponents } from "@/components/project-mdx";
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

/*
 * The write-up reads top to bottom with nothing beside it: the title, the intro, then the MDX
 * sections (a heading, a paragraph or two and one image each), how it was built, and the links back
 * and on. The cover stays in the frontmatter as the social preview image.
 */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;
  const next = getNextProject(slug);

  return (
    <article className="page-column">
      <header>
        <h1 className="text-title my-6.5">{meta.title}</h1>
        <p className="mb-9.25 text-(--fg)">{meta.intro}</p>
        {meta.url ? (
          <p className="mb-9.25">
            <a href={meta.url} target="_blank" rel="noopener noreferrer">
              Open {meta.title}
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
        ) : null}
      </header>

      <div className="prose">
        <MDXRemote source={content} components={projectMdxComponents} />
        <section aria-labelledby="how-i-built-it">
          <h2 id="how-i-built-it">How I built it</h2>
          <p>{meta.workflow}</p>
          {meta.stack.length > 0 ? <p>Built with {meta.stack.join(", ")}.</p> : null}
        </section>
      </div>

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
