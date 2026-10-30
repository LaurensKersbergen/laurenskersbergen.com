import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeftIcon, ArrowRightIcon, Badge, buttonClass, cn, DescriptionList, LinkOrAnchor, Media } from "@kit/ui";
import { LogoLink } from "@/components/logo-link";
import { breakoutMedium, breakoutWide, projectMdxComponents } from "@/components/project-mdx";
import { getNextProject, getProject, getProjects, previewImage, statusTone } from "@/lib/projects";

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

  const facts = [
    { term: "Role", details: meta.role },
    { term: "Year", details: meta.year },
    { term: "Status", details: <Badge tone={statusTone(meta.status)}>{meta.status}</Badge> },
    { term: "Built with", details: meta.stack.join(", ") },
  ];
  if (meta.url) {
    facts.push({
      term: "Live",
      details: (
        <LogoLink href={meta.url} logo={meta.logo}>
          {meta.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
        </LogoLink>
      ),
    });
  }

  const pill = cn(buttonClass({ variant: "ghost" }), "no-underline!");

  return (
    <article className="mt-16">
      <header className={breakoutMedium}>
        <h1 className="text-xl md:text-2xl font-medium mb-1" style={{ lineHeight: "3.25rem" }}>
          {meta.title}
        </h1>
        <div className="grid gap-x-16 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <p className="my-0 md:mt-1 text-prose" style={{ color: "var(--text-copy)" }}>
            {meta.intro}
          </p>
          <DescriptionList items={facts} className="self-start grid-cols-[6rem_minmax(0,1fr)] md:grid-cols-[5.5rem_minmax(0,1fr)]" />
        </div>
      </header>

      <Media
        src={meta.cover}
        poster={meta.poster}
        alt={meta.title}
        priority
        sizes="(min-width: 1164px) 1100px, 100vw"
        className={cn(breakoutWide, "my-12 md:my-16")}
      />

      <div className="prose">
        <MDXRemote source={content} components={projectMdxComponents} />
      </div>

      <section aria-labelledby="how-i-built-it" className="prose mt-12">
        <h2 id="how-i-built-it">How I built it</h2>
        <p>{meta.workflow}</p>
        <ul>
          {meta.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>

      <nav aria-label="Projects" className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6 text-ink-2">
        <LinkOrAnchor render={<Link href="/projects" />} className={cn(pill, "-ml-3")}>
          <ArrowLeftIcon />
          All projects
        </LinkOrAnchor>
        {next ? (
          <LinkOrAnchor render={<Link href={`/projects/${next.slug}`} />} className={cn(pill, "-mr-3 min-w-0")}>
            <span className="truncate">Next: {next.title}</span>
            <ArrowRightIcon />
          </LinkOrAnchor>
        ) : null}
      </nav>
    </article>
  );
}
