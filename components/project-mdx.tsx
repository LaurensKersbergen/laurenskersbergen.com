import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { cn, Embed, Media } from "@kit/ui";
import { LightboxMediaGrid } from "@/components/image-gallery";
import { MdxLink } from "@/mdx-components";

/**
 * A media block in a write-up: 780px wide, 50px past the 680px column on each side once the window
 * has room (media-wide in globals.css), full width on phones, with 37px above and below.
 */
export const mediaBlock = "media-wide my-9.25";

/** The MDX names a project write-up can use, for MDXRemote's `components`. */
export const projectMdxComponents: MDXComponents = {
  a: MdxLink,
  Media,
  MediaGrid: ({ className, ...props }: ComponentProps<typeof LightboxMediaGrid>) => (
    <LightboxMediaGrid {...props} className={cn(mediaBlock, className)} data-no-hover-sound />
  ),
  Embed: ({ className, ...props }: ComponentProps<typeof Embed>) => <Embed {...props} className={cn("my-9.25", className)} />,
};
