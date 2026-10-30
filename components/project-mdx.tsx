import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { cn, Embed, Media } from "@kit/ui";
import { LightboxMediaGrid } from "@/components/image-gallery";
import { MdxLink } from "@/mdx-components";

/**
 * Wider than the 650px reading column, centred on it, the way the About page's gallery breaks
 * out. Phones keep the column's width; from `md` a 2rem gutter stays on each side.
 */
export const breakoutWide = "relative w-full md:left-1/2 md:-translate-x-1/2 md:w-[calc(100vw-4rem)] md:max-w-[1100px]";
export const breakoutMedium = "relative w-full md:left-1/2 md:-translate-x-1/2 md:w-[calc(100vw-4rem)] md:max-w-[960px]";

/** The MDX names a project write-up can use, for MDXRemote's `components`. */
export const projectMdxComponents: MDXComponents = {
  a: MdxLink,
  Media,
  MediaGrid: ({ className, ...props }: ComponentProps<typeof LightboxMediaGrid>) => (
    <LightboxMediaGrid {...props} className={cn(breakoutWide, "my-10 md:my-14", className)} data-no-hover-sound />
  ),
  Embed: ({ className, ...props }: ComponentProps<typeof Embed>) => <Embed {...props} className={cn("my-8", className)} />,
};
