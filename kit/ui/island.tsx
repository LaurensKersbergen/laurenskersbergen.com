"use client";

import { type CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { type LinkRender, LinkOrAnchor } from "./link";

/*
 * New to the kit (kit/README.md): the floating island menu. A small pill at the bottom centre that
 * names the current section and grows upward, from the same anchor, into a panel with the links
 * stacked above it. It follows the disclosure pattern (a button and a plain list of links), not an
 * ARIA menu: Escape, an outside press, a route change and focus leaving it all close it, and the
 * collapsed list is inert. On mouse and trackpad it also opens on hover, with a short close delay;
 * a click while it is hover-opened pins it open.
 *
 * CSS can't animate to or from `auto` in Safari, so the component measures the label row and the
 * list with a ResizeObserver and writes the size to --island-w and --island-h; the size moves on
 * the spring curve (ease-spring), the links settle in with a stagger. With reduced motion only the
 * opacity changes, at the base speed.
 */

export type IslandLink = {
  href: string;
  label: string;
  /** The link for the section the visitor is in; it gets aria-current="page". */
  current?: boolean;
  /** The app's router link, e.g. Next.js <Link href="/projects" />, so navigation doesn't reload the page. */
  render?: LinkRender;
};

/** How the island was opened: by hover (closes when the pointer leaves), by a press, or pinned by a press while hover-opened. */
type OpenedBy = "hover" | "press" | "pinned" | null;

const CLOSE_DELAY_MS = 200;
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type Sizes = { pillW: number; pillH: number; listW: number; listH: number };

function writeSize(surface: HTMLElement | null, sizes: Sizes | null, open: boolean) {
  if (!surface || !sizes) return;
  surface.style.setProperty("--island-w", `${open ? Math.max(sizes.listW, sizes.pillW) : sizes.pillW}px`);
  surface.style.setProperty("--island-h", `${open ? sizes.listH + sizes.pillH : sizes.pillH}px`);
  surface.style.setProperty("--island-r", `${sizes.pillH / 2}px`);
}

export function Island({
  label,
  links,
  path,
  navLabel = "Site",
  className,
}: {
  /** The current section's name, shown in the pill. */
  label: string;
  links: IslandLink[];
  /** The current route; the island closes when it changes. */
  path?: string;
  /** The accessible name of the navigation landmark. */
  navLabel?: string;
  className?: string;
}) {
  const listId = useId();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sizes = useRef<Sizes | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [openedBy, setOpenedBy] = useState<OpenedBy>(null);
  const open = openedBy !== null;
  const openRef = useRef(open);
  // Transitions switch on after the first measurement, so nothing animates on page load.
  const [ready, setReady] = useState(false);

  // A route change closes it.
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpenedBy(null);
  }

  // When the label changes, the old one stays a moment to cross-fade out.
  const [shown, setShown] = useState(label);
  const [leaving, setLeaving] = useState<string | null>(null);
  if (label !== shown) {
    setLeaving(shown);
    setShown(label);
  }

  function clearCloseTimer() {
    clearTimeout(closeTimer.current);
  }

  useLayoutEffect(() => {
    const row = rowRef.current;
    const list = listRef.current;
    if (!row || !list) return;
    const measure = () => {
      const rowBox = row.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      sizes.current = { pillW: Math.ceil(rowBox.width), pillH: Math.ceil(rowBox.height), listW: Math.ceil(listBox.width), listH: Math.ceil(listBox.height) };
      writeSize(surfaceRef.current, sizes.current, openRef.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(list);
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    openRef.current = open;
    writeSize(surfaceRef.current, sizes.current, open);
  }, [open]);

  // The kit stops all motion for reduced motion (theme.css); here a short fade stays, as an inline
  // !important, the only thing that outranks that rule.
  useLayoutEffect(() => {
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    for (const element of surfaceRef.current?.querySelectorAll<HTMLElement>("[data-island-fade]") ?? []) {
      if (reduce) element.style.setProperty("transition-duration", "var(--ui-duration-base)", "important");
      else element.style.removeProperty("transition-duration");
    }
  });

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (surfaceRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
      setOpenedBy(null);
    }
    function onPointerDown(event: PointerEvent) {
      if (!surfaceRef.current?.contains(event.target as Node)) setOpenedBy(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => clearCloseTimer, []);

  const labels = leaving ? [{ text: leaving, leaving: true }, { text: shown, leaving: false }] : [{ text: shown, leaving: false }];

  return (
    <nav
      aria-label={navLabel}
      data-ready={ready ? "" : undefined}
      className={cn("pointer-events-none fixed inset-x-0 bottom-[calc(--spacing(4)_+_env(safe-area-inset-bottom))] z-40 flex justify-center", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenedBy(null);
      }}
    >
      <div
        ref={surfaceRef}
        className={cn(
          "pointer-events-auto relative flex flex-col justify-end overflow-hidden contain-layout contain-paint",
          "h-(--island-h) w-(--island-w) rounded-[var(--island-r,calc(infinity*1px))]",
          "bg-popover/90 text-ink shadow-overlay backdrop-blur-xl backdrop-saturate-150",
          ready && "transition-[width,height] ease-spring motion-reduce:transition-none",
          open ? "duration-spring" : "duration-spring-out",
        )}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse" || !window.matchMedia(HOVER_QUERY).matches) return;
          clearCloseTimer();
          setOpenedBy((current) => current ?? "hover");
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          clearCloseTimer();
          closeTimer.current = setTimeout(() => setOpenedBy((current) => (current === "hover" ? null : current)), CLOSE_DELAY_MS);
        }}
      >
        <div className="relative w-full shrink-0">
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => {
              clearCloseTimer();
              setOpenedBy((current) => (current === "hover" ? "pinned" : current ? null : "press"));
            }}
            className="flex w-full cursor-pointer select-none justify-center rounded-(--island-r) focus-visible:-outline-offset-2"
          >
            <span ref={rowRef} className="relative flex h-10 items-center whitespace-nowrap px-4 text-[0.9375rem] font-medium pointer-coarse:h-11 pointer-coarse:px-5">
              {labels.map((item) => (
                <span
                  key={item.text}
                  data-island-fade=""
                  aria-hidden={item.leaving || undefined}
                  onTransitionEnd={(event) => {
                    if (item.leaving && event.target === event.currentTarget && event.propertyName === "opacity") setLeaving(null);
                  }}
                  className={cn(
                    ready && "transition-[opacity,filter,scale] ease-spring motion-reduce:transition-opacity",
                    item.leaving
                      ? "absolute inset-0 flex items-center justify-center opacity-0 blur-xs scale-96 duration-spring-out motion-reduce:blur-none motion-reduce:scale-100"
                      : cn("duration-spring", ready && "starting:opacity-0 starting:blur-xs starting:scale-96 motion-reduce:starting:blur-none motion-reduce:starting:scale-100"),
                  )}
                >
                  {item.text}
                </span>
              ))}
            </span>
          </button>
          <ul
            ref={listRef}
            id={listId}
            inert={!open}
            onClick={(event) => {
              if ((event.target as Element).closest("a")) setOpenedBy(null);
            }}
            // The hairline under the links separates them from the label row; collapsed, it is clipped away with them.
            className="absolute bottom-full left-1/2 flex w-max min-w-[max(100%,--spacing(44))] -translate-x-1/2 flex-col p-1.5 after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-line"
          >
            {links.map((link, index) => (
              <li
                key={link.href}
                data-island-fade=""
                // Links settle in from the label upward and leave from the top down.
                style={{ "--i": open ? links.length - 1 - index : index } as CSSProperties}
                className={cn(
                  ready && "transition-[opacity,filter,scale] ease-spring delay-[calc(var(--ui-spring-stagger)*var(--i))] motion-reduce:transition-opacity motion-reduce:delay-0",
                  open ? "duration-spring" : "duration-spring-out opacity-0 blur-xs scale-96 motion-reduce:blur-none motion-reduce:scale-100",
                )}
              >
                <LinkOrAnchor
                  href={link.href}
                  render={link.render}
                  aria-current={link.current ? "page" : undefined}
                  className="group/link block rounded-[calc(var(--island-r)_-_--spacing(1.5))] no-underline!"
                >
                  <span className="flex h-9 items-center justify-center whitespace-nowrap rounded-[inherit] px-4 text-[0.9375rem] text-ink-2 transition-colors group-hover/link:bg-hover group-hover/link:text-ink group-aria-[current=page]/link:bg-selected group-aria-[current=page]/link:text-ink pointer-coarse:h-11">
                    {link.label}
                  </span>
                </LinkOrAnchor>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
