/*
 * New to the kit (kit/README.md): Embed, a live product in a lazy, sandboxed frame. Many sites
 * refuse to be framed, so a link out always sits beneath it. String props only, for MDX.
 */
import { cn } from "./cn";
import { ArrowUpRightIcon } from "./icons";

/** The frame keeps `ratio` ("3:2", "16:10") so the page doesn't shift; `title` names it for screen readers. */
export function Embed({ src, title, ratio = "3:2", className }: { src: string; title: string; ratio?: string; className?: string }) {
  const label = src.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div
        className="relative w-full overflow-hidden rounded-card bg-fill after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-ink/10 after:ring-inset"
        style={{ aspectRatio: ratio.replace(":", " / ") }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="absolute inset-0 size-full border-0"
        />
      </div>
      <div className="text-control text-ink-2">
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
          Open {label}
          <ArrowUpRightIcon size={14} />
        </a>
      </div>
    </div>
  );
}
