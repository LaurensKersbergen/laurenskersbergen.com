import Link from "next/link";
import { cn, groupLabelClass, List, ListItem, Thumbnail } from "@kit/ui";
import { LogoLink } from "@/components/logo-link";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const projects = getProjects();

  return (
    <div className="mt-16">
      <h1 className="text-xl md:text-2xl font-medium mb-1" style={{ lineHeight: "3.25rem" }}>Laurens Kersbergen</h1>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I'm a product manager in Amsterdam, currently working at "}
        <LogoLink href="https://miro.com/" logo="/logos/miro.png">Miro</LogoLink>
        {" on databases and AI for visual collaboration."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"Before Miro, I founded a B2B SaaS company (learned to build with zero resources), then scaled products to millions at "}
        <LogoLink href="https://www.kpn.com/" logo="/logos/kpn.png">KPN</LogoLink>
        {" (learned enterprise quality). That combination of founder speed and enterprise discipline defines how I work."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I get energy from technically complex problems that create simple experiences. I believe in craft, sweating details that make products feel right, while moving fast enough to learn. I thrive on small, convicted teams that move fast and think big."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I live in Amsterdam with my partner, our two-year-old daughter, and cat Dries. You'll find me doing CrossFit, competing in HYROX races, cooking for friends, or pulling god-shot double espressos. Weekends: gaming with friends, building side projects (just shipped a hyper-personalized meal planning app), or skiing if it's winter. Also bit of a biohacker."}
      </p>
      {projects.length > 0 ? (
        <section aria-labelledby="projects-heading" className="my-5">
          <h2 id="projects-heading" className={cn(groupLabelClass, "text-ink-2")}>
            Projects
          </h2>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.slug}
                variant="reading"
                render={<Link href={`/projects/${project.slug}`} className="no-underline!" />}
                leading={
                  // Sized and outlined like the logos in the intro (.logo-link-icon).
                  <Thumbnail
                    src={project.logo}
                    className="size-[1.1em] rounded-tiny bg-transparent outline outline-(--image-outline) -outline-offset-1 [&_img]:p-0"
                  />
                }
                title={<span className="font-semibold">{project.title}</span>}
                description={project.tagline}
              />
            ))}
          </List>
          <p className="mt-2">
            <Link href="/projects">All projects</Link>
          </p>
        </section>
      ) : null}
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        <Link href="/about">More about me</Link>
        {" · "}
        <a href="mailto:hey@laurenskersbergen.com">Reach out</a>
      </p>
    </div>
  );
}
