import { Intro } from "@/components/home/intro";
import { ProjectCarousel } from "@/components/home/project-carousel";
import { Timeline } from "@/components/home/timeline";
import { getProjects, toCard } from "@/lib/projects";

export default function Home() {
  const projects = getProjects().map(toCard);

  return (
    <div className="page-top">
      <Intro />
      <div className="mt-28 max-md:mt-20">
        <ProjectCarousel projects={projects} />
      </div>
      <div className="mt-36 max-md:mt-24">
        <Timeline />
      </div>
    </div>
  );
}
