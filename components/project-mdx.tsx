import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { ProjectScene } from "@/components/scenes";
import { MdxLink } from "@/mdx-components";

/**
 * The MDX names a project page can use, for MDXRemote's `components`: a Scene is one media block,
 * a Stageshow scene on the project's ground with the site's 24px media corners; a Pair puts two side by
 * side (stacked on phones). Headings and paragraphs between them become a short write-up section.
 */
export const projectMdxComponents: MDXComponents = {
  a: MdxLink,
  Scene: ({ name }: { name: string }) => (
    <figure className="media-frame" data-reveal>
      <ProjectScene name={name} />
    </figure>
  ),
  Pair: ({ children }: { children: ReactNode }) => <div className="media-pair">{children}</div>,
};
