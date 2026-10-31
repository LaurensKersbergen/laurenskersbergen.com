"use client";

import { type CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { type LinkRender, LinkOrAnchor } from "./link";

/*
 * New to the kit (kit/README.md): the floating island menu. A small "Menu" pill in the top-right
 * corner; pressing it grows the pill downward and wider into a panel of links, in groups split by
 * hairlines, with the toggle as the panel's first row, now reading "Close". The look and motion live
 * in theme.css (.ui-island) and tokens.css (the springs and the surface).
 *
 * It follows the disclosure pattern (a button and a plain list of links), not an ARIA menu. Only a
 * press on the toggle opens it; a second press, Escape, a press outside, following a link, a route
 * change and keyboard focus leaving it all close it, and the collapsed list is inert. On phones,
 * scrolling down the page hides it and scrolling back up shows it again.
 */

export type IslandLink = {
  href: string;
  label: string;
  /** The link for the section the visitor is in; it gets aria-current="page". */
  current?: boolean;
  /** The app's router link, e.g. Next.js <Link href="/projects" />, so navigation doesn't reload the page. */
  render?: LinkRender;
  /** Starts a new group: a hairline above this link. */
  startsGroup?: boolean;
};

type Row = { kind: "link"; link: IslandLink } | { kind: "divider"; key: string };

/* Each toggle redraws the four spring speeds from their tokens, between 85% and 115% of each. */
const SPEEDS = [
  ["--island-duration-close-x", "--ui-duration-spring-x-out"],
  ["--island-duration-close-y", "--ui-duration-spring-y-out"],
  ["--island-duration-open-x", "--ui-duration-spring-x"],
  ["--island-duration-open-y", "--ui-duration-spring-y"],
] as const;

/* The open window is the panel plus this much: the nav's border (2px) and 8px of room below and above the panel. */
const OPEN_EXTRA_HEIGHT = 18;
/* On phones the collapsed pill is the label plus this much: the panel's side padding (44px) and the nav's border (2px). */
const LABEL_EXTRA_WIDTH = 46;
/* Scrolling hides the island once the page is this far down, and shows it again after scrolling up this much. */
const SCROLL_HIDE_FROM = 80;
const SCROLL_SHOW_AFTER = 60;
/* Transitions pause this long after the window resizes. */
const RESIZE_PAUSE_MS = 150;

/** A CSS time in milliseconds; build tools may rewrite "590ms" as ".59s". */
function toMs(time: string) {
  const value = Number.parseFloat(time);
  return time.trim().endsWith("ms") ? value : value * 1000;
}

function varySpeeds(nav: HTMLElement) {
  const style = getComputedStyle(nav);
  for (const [property, token] of SPEEDS) {
    const base = toMs(style.getPropertyValue(token));
    nav.style.setProperty(property, `${Math.round(base * (0.85 + 0.3 * Math.random()))}ms`);
  }
}

function rowsFor(links: IslandLink[]): Row[] {
  const rows: Row[] = [];
  links.forEach((link, index) => {
    if (link.startsGroup && index > 0) rows.push({ kind: "divider", key: `divider-${link.href}` });
    rows.push({ kind: "link", link });
  });
  // A hairline always separates the toggle from the links below it.
  rows.unshift({ kind: "divider", key: "divider-toggle" });
  return rows;
}

export function Island({
  label,
  closeLabel = "Close",
  links,
  path,
  navLabel = "Site",
  className,
}: {
  /** The toggle's text while the island is collapsed, e.g. "Menu". */
  label: string;
  /** The toggle's text while the island is open, when pressing it closes the panel. */
  closeLabel?: string;
  links: IslandLink[];
  /** The current route; the island closes when it changes. */
  path?: string;
  /** The accessible name of the navigation landmark. */
  navLabel?: string;
  className?: string;
}) {
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // A press inside the island moves focus to nothing in Safari (or to its padding), which isn't focus leaving it.
  const pressingInside = useRef(false);

  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  const [scrollHidden, setScrollHidden] = useState(false);
  // Marks the island as hydrated, so tests and scripts know the toggle works.
  const [ready, setReady] = useState(false);

  // A route change closes it.
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  /** Opens or closes it with freshly varied spring speeds. */
  function toggle(next: boolean) {
    if (navRef.current) varySpeeds(navRef.current);
    setOpen(next);
  }

  useLayoutEffect(() => {
    openRef.current = open;
  }, [open]);

  // Measures the open height, and on phones the collapsed width that fits the label, without animating it.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const inner = innerRef.current;
    const button = buttonRef.current;
    if (!nav || !inner || !button) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      nav.style.setProperty("--island-open-h", `${inner.scrollHeight + OPEN_EXTRA_HEIGHT}px`);
      if (openRef.current) return;
      const range = document.createRange();
      range.selectNodeContents(button);
      const width = range.getBoundingClientRect().width;
      if (width <= 0) return;
      nav.setAttribute("data-no-anim", "");
      nav.style.setProperty("--island-collapsed-fit", `${width + LABEL_EXTRA_WIDTH}px`);
      void nav.offsetWidth;
      nav.removeAttribute("data-no-anim");
    };
    measure();
    // The label's width changes if the web font arrives after the first measurement.
    document.fonts?.ready.then(measure);
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    function onResize() {
      nav!.setAttribute("data-no-anim", "");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => nav!.removeAttribute("data-no-anim"), RESIZE_PAUSE_MS);
    }
    let lastY = window.scrollY;
    let scrolledUp = 0;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (openRef.current || y <= SCROLL_HIDE_FROM) {
        scrolledUp = 0;
        setScrollHidden(false);
      } else if (delta > 0) {
        scrolledUp = 0;
        setScrollHidden(true);
      } else if (delta < 0) {
        scrolledUp -= delta;
        if (scrolledUp >= SCROLL_SHOW_AFTER) setScrollHidden(false);
      }
    }
    function onPressEnd() {
      pressingInside.current = false;
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerup", onPressEnd, true);
    document.addEventListener("pointercancel", onPressEnd, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerup", onPressEnd, true);
      document.removeEventListener("pointercancel", onPressEnd, true);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function close() {
      if (navRef.current) varySpeeds(navRef.current);
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (navRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
      close();
    }
    function onClick(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const rows = rowsFor(links);

  return (
    <nav
      ref={navRef}
      aria-label={navLabel}
      data-motion="own"
      data-ready={ready ? "" : undefined}
      data-open={open ? "" : undefined}
      data-scroll-hidden={scrollHidden ? "" : undefined}
      className={cn("ui-island", className)}
      onPointerDown={() => {
        pressingInside.current = true;
      }}
      onBlur={(event) => {
        if (!open) return;
        const next = event.relatedTarget as Node | null;
        if (next ? event.currentTarget.contains(next) : pressingInside.current) return;
        toggle(false);
      }}
    >
      <div ref={innerRef} className="ui-island-inner">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          className="ui-island-trigger"
          onClick={(event) => {
            event.preventDefault();
            toggle(!open);
          }}
        >
          {open ? closeLabel : label}
        </button>
        <ul
          id={listId}
          inert={!open}
          className="ui-island-list"
          onClick={(event) => {
            // Following a link closes it; a link opened in a new tab or window leaves it open.
            if (!(event.target as Element).closest("a")) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            setOpen(false);
          }}
        >
          {rows.map((row, index) => {
            // Counted down from the toggle, for the stagger.
            const style = { "--island-i": index } as CSSProperties;
            if (row.kind === "divider") return <li key={row.key} aria-hidden="true" className="ui-island-item ui-island-divider" style={style} />;
            const { link } = row;
            return (
              <li key={link.href} className="ui-island-item" style={style}>
                <LinkOrAnchor href={link.href} render={link.render} aria-current={link.current ? "page" : undefined} className="ui-island-link">
                  {link.label}
                </LinkOrAnchor>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
