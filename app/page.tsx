import { Approach } from "@/components/home/approach";
import { Contact } from "@/components/home/contact";
import { Intro } from "@/components/home/intro";
import { ProjectCarousel } from "@/components/home/project-carousel";
import { Timeline } from "@/components/home/timeline";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getProjects, toCard } from "@/lib/projects";
import { pageMetadata, person, website } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function Home() {
  const projects = getProjects().map(toCard);

  return (
    <div className="page-top">
      <JsonLd data={{ "@graph": [person, website] }} />
      <Intro />
      {/* One rhythm, measured on what you see (a line's baseline or a card's or button's edge, to
          the capitals of what comes next): 144px between sections, 96px on phones, the footer
          included. The intro sits a step closer to the work it opens (120px, 80px on phones). Each
          margin is that gap less the room the section above keeps under its last line or box; the
          footer keeps the same gap itself (site.css). */}
      <div className="mt-[101px] max-md:mt-[66px]">
        <ProjectCarousel projects={projects} />
      </div>
      <div className="mt-[112px] max-md:mt-[65px]">
        <Timeline />
      </div>
      <div className="mt-[118px] max-md:mt-[75px]">
        <Approach />
      </div>
      <div className="mt-[129px] max-md:mt-[84px]">
        <Contact />
      </div>
    </div>
  );
}
