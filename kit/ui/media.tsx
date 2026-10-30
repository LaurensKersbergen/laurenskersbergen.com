"use client";

/*
 * New to the kit (kit/README.md): Media and MediaGrid, images and videos with captions for
 * write-ups. Every prop is a string so MDX can pass it (next-mdx-remote strips {…} expressions).
 */
import Image from "next/image";
import { Children, createContext, isValidElement, use, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { cn } from "./cn";

export type MediaImage = { src: string; alt: string };

const MediaGridContext = createContext<{ columns: number; onOpen?: (image: MediaImage) => void } | null>(null);

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/* A hairline inside the frame, so a white screenshot keeps its edge on a white page. */
const frame =
  "relative block w-full overflow-hidden rounded-card bg-fill after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-ink/10 after:ring-inset";

/**
 * An image or a muted, looping video in a box of `ratio` ("3:2", "16:9"), so nothing shifts as it
 * loads. `alt` describes it (a video's aria-label). A video has no autoplay attribute, because the
 * server can't know the visitor's motion setting: it plays once the browser says motion is fine,
 * and otherwise shows its `poster` with controls. Inside a MediaGrid with `onOpen`, an image is a
 * button that opens it larger.
 */
export function Media({
  src,
  alt,
  caption,
  poster,
  ratio = "3:2",
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  ratio?: string;
  /** next/image `sizes`; inside a MediaGrid it follows the number of columns. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const grid = use(MediaGridContext);
  const aspectRatio = ratio.replace(":", " / ");
  const imageSizes = sizes ?? (grid && grid.columns > 1 ? `(min-width: 768px) ${Math.round(100 / grid.columns)}vw, 100vw` : "100vw");
  const onOpen = grid?.onOpen;

  let content;
  if (isVideo(src)) {
    content = (
      <div className={frame} style={{ aspectRatio }}>
        <Video src={src} poster={poster} label={alt} />
      </div>
    );
  } else {
    const image = <Image src={src} alt={alt} fill sizes={imageSizes} priority={priority} className="object-cover" />;
    content = onOpen ? (
      <button type="button" onClick={() => onOpen({ src, alt })} className={cn(frame, "cursor-zoom-in border-0 p-0")} style={{ aspectRatio }}>
        {image}
      </button>
    ) : (
      <div className={frame} style={{ aspectRatio }}>
        {image}
      </div>
    );
  }

  return (
    <figure className={cn("m-0 min-w-0", className)}>
      {content}
      {caption ? <figcaption className="mt-2.5 text-control text-ink-2">{caption}</figcaption> : null}
    </figure>
  );
}

function Video({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [controls, setControls] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      // Low-power modes can refuse to play; then the visitor starts it.
      video.play().catch(() => setControls(true));
    } else {
      setControls(true);
    }
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      className="absolute inset-0 size-full object-cover"
    />
  );
}

const gridColumns: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/**
 * One to four Media side by side on wide screens, stacked on phones. Pass `onOpen` to open an
 * image larger (the app's lightbox); without it the images are plain.
 */
export function MediaGrid({
  children,
  onOpen,
  className,
  ...props
}: ComponentProps<"div"> & { onOpen?: (image: MediaImage) => void }) {
  const columns = Math.min(Math.max(Children.toArray(children).filter(isValidElement).length, 1), 4);
  const context = useMemo(() => ({ columns, onOpen }), [columns, onOpen]);

  return (
    <MediaGridContext value={context}>
      <div className={cn("grid grid-cols-1 items-start gap-4", gridColumns[columns], className)} {...props}>
        {children}
      </div>
    </MediaGridContext>
  );
}
