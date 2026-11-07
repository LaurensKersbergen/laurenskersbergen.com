import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BookCall } from "@/components/book-call";
import { CopyEmail } from "@/components/copy-email";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, person, personId } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { timeline } from "@/lib/timeline";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Laurens Kersbergen, a product manager in Amsterdam: databases and AI at Miro, growth at KPN before that, and a B2B SaaS company of his own.",
  path: "/about",
});

/* The jobs, newest first, from the homepage's timeline (lib/timeline.ts). The side projects have
   their own page. */
const work = timeline.filter((entry) => entry.name !== "Side projects");

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The title and portrait on the left, the words on the right, starting level with the portrait:
 * the words open a size up with the second sentence quieter, as the homepage's intro does, then
 * the work as rows, then one way in. No section labels: each part reads for what it is. On wide
 * screens the title and portrait stay in view together while the words scroll past them; below
 * 992px it all stacks.
 */
export default function AboutPage() {
  return (
    <article className="page-top">
      <JsonLd data={{ "@graph": [{ "@type": "ProfilePage", url: `${siteUrl}/about`, name: "About Laurens Kersbergen", mainEntity: { "@id": personId } }, person] }} />
      <div className="shell about">
        <div className="about__aside" data-reveal>
          <h1 className="display-xl about__title">About me</h1>
          {/* The engraved portrait on its own paper, a square tile with the site's media corners. */}
          <Image
            src="/images/laurens-portrait.webp"
            alt="An engraved portrait of Laurens Kersbergen, smiling"
            width={1254}
            height={1254}
            priority
            sizes="(max-width: 48rem) 70vw, 320px"
            className="about-portrait"
          />
        </div>

        <div className="about__body">
          <p className="intro-text about__lead" data-reveal style={delay(120)}>
            {"I'm Laurens Kersbergen, a product manager living in Amsterdam. "}
            <span className="about__lead-muted">I currently work at Miro, where I focus on databases and AI for visual collaboration.</span>
          </p>

          <div className="about__prose" data-reveal style={delay(200)}>
            <p>
              Before Miro, I founded a B2B SaaS company where I learned to build products with extreme constraints and no playbook. After that, I
              scaled products to millions of users at KPN, learning how to ship at enterprise quality.
            </p>
            <p>
              As a product manager, I get energy from solving technically complex problems that create simple user experiences. I believe in the
              importance of craft, sweating the details that make products feel right, while moving fast enough to learn.
            </p>
            <p>
              I live in Amsterdam with my partner, our two-year-old daughter, and our cat Dries. In my free time, you can find me doing CrossFit,
              competing in HYROX races, or cooking for friends. I&apos;m also down the barista rabbit hole, pulling god-shot double espressos every
              morning.
            </p>
          </div>

          <section className="about__section" aria-labelledby="about-work" data-reveal>
            <h2 id="about-work" className="sr-only">
              Work
            </h2>
            <ul className="about-work">
              {work.map((entry) => (
                <li key={entry.name}>
                  <Link href={entry.href ?? "/projects"} className="about-work__row">
                    <span className="about-work__name">{entry.name}</span>
                    <span className="about-work__role">{entry.role}</span>
                    <span className="about-work__period">{entry.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* The address is the pill under it, so the sentence needs no link of its own. */}
          <section className="about__section" aria-label="Get in touch" data-reveal>
            <p className="about__contact">Feel free to reach out if you want to chat about product, collaboration tools, or 0→1 development.</p>
            <div className="contact__actions">
              <BookCall className="pill pill--strong" />
              <CopyEmail />
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
