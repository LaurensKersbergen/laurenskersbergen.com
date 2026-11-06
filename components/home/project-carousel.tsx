"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@kit/ui";
import { ProjectCard, type Card } from "@/components/project-card";

/** How far past a release a fling carries the track, per px/ms of pointer speed. */
const FLING = 260;

/**
 * The projects in a row that runs off the right edge. It scrolls
 * natively (a swipe on touch, a trackpad sideways), snaps a card to the page column, and on a mouse
 * it can be dragged and flung; the arrows step a card at a time. A hairline under it shows how far
 * along you are. Each card's scene plays while the pointer is over it.
 */
export function ProjectCarousel({ projects }: { projects: Card[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [position, setPosition] = useState({ progress: 0, share: 1 });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    setPosition({ progress: max > 0 ? el.scrollLeft / max : 0, share: Math.min(1, el.clientWidth / el.scrollWidth) });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      resize.disconnect();
    };
  }, [measure]);

  /** The card starts the track can rest on: each card's left edge, less the page edge. */
  const stops = useCallback(() => {
    const el = track.current;
    if (!el) return [0];
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const max = el.scrollWidth - el.clientWidth;
    return Array.from(el.children, (child) => Math.min(max, Math.max(0, (child as HTMLElement).offsetLeft - pad)));
  }, []);

  /** Glide to a resting point, with snapping held off until it arrives, so the two never fight. */
  const glideTo = useCallback((left: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.setAttribute("data-gliding", "");
    el.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    let last = -1;
    let still = 0;
    const settle = () => {
      if (Math.abs(el.scrollLeft - last) < 0.5) still++;
      else still = 0;
      last = el.scrollLeft;
      if (still > 3) el.removeAttribute("data-gliding");
      else requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      const el = track.current;
      if (!el) return;
      const points = stops();
      const now = el.scrollLeft;
      const target = direction > 0 ? points.find((p) => p > now + 4) : [...points].reverse().find((p) => p < now - 4);
      glideTo(target ?? (direction > 0 ? el.scrollWidth : 0));
    },
    [glideTo, stops],
  );

  /* Dragging with a mouse: the track follows the pointer, and on release carries on by the
     pointer's speed to the nearest card. Touch and pens scroll natively. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let drag: { x: number; left: number; moved: boolean; samples: { x: number; t: number }[] } | null = null;

    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, left: el.scrollLeft, moved: false, samples: [{ x: event.clientX, t: event.timeStamp }] };
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        el.setAttribute("data-dragging", "");
        el.setPointerCapture(event.pointerId);
      }
      if (!drag.moved) return;
      el.scrollLeft = drag.left - dx;
      drag.samples.push({ x: event.clientX, t: event.timeStamp });
      if (drag.samples.length > 6) drag.samples.shift();
    };
    const up = () => {
      if (!drag) return;
      const { moved, samples } = drag;
      drag = null;
      if (!moved) return;
      /* The click that follows this release still sees the drag, and is cancelled below. */
      requestAnimationFrame(() => el.removeAttribute("data-dragging"));
      const first = samples[0];
      const last = samples[samples.length - 1];
      const velocity = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
      const aim = el.scrollLeft - velocity * FLING;
      const points = stops();
      const nearest = points.reduce((best, p) => (Math.abs(p - aim) < Math.abs(best - aim) ? p : best), points[0]);
      glideTo(nearest);
    };
    /* A drag that ends over a card must not open it. */
    const click = (event: MouseEvent) => {
      if (el.hasAttribute("data-dragging")) event.preventDefault();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, [glideTo, stops]);

  return (
    <section aria-labelledby="work-title" className="carousel">
      <div className="shell section-head" data-reveal>
        <h2 id="work-title" className="section-title">
          Selected work
        </h2>
        <div className="carousel__controls">
          <button type="button" className="round-button" aria-label="Previous projects" disabled={edges.start} onClick={() => step(-1)}>
            <ArrowLeftIcon size={18} />
          </button>
          <button type="button" className="round-button" aria-label="Next projects" disabled={edges.end} onClick={() => step(1)}>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="carousel__track"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        data-no-hover-sound
      >
        {projects.map((project, i) => (
          <div key={project.slug} className="carousel__item" data-reveal="x" style={{ "--reveal-delay": `${120 + i * 90}ms` } as CSSProperties}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <div className="shell" aria-hidden="true">
        <div className="carousel__progress" style={{ "--progress": position.progress, "--share": position.share } as CSSProperties}>
          <span className="carousel__thumb" />
        </div>
      </div>
    </section>
  );
}
