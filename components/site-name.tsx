"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BookCall } from "@/components/book-call";

/** The loupe at full size: its diameter, how much it magnifies, and the room it keeps from the window's edge. */
const LENS = 88;
const ZOOM = 3;
const EDGE = 8;
/** How near the avatar's centre the pointer has to come to pick the lens up: its 12px radius and 8px more. */
const REACH = 20;

/**
 * "laurens" in the top-left corner, dressed as the collapsed menu across from it (.ui-island-pill),
 * linking home. Fixed and level with the menu, so it stays as the page scrolls (site.css).
 */
export function SiteName() {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);

  useLoupe(root, lens, view);

  return (
    <div className="site-name" ref={root}>
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className="ui-island-pill"
      >
        <Avatar />
        laurens
      </Link>

      {/* The loupe: a copy of the pill, magnified behind a round glass (site.css). Decorative. */}
      <div className="loupe" ref={lens} aria-hidden>
        <div className="loupe__view" ref={view}>
          <div className="ui-island-pill">
            <Avatar />
            laurens
          </div>
        </div>
      </div>
    </div>
  );
}

/* 24px in the 36px pill (site.css), loaded big enough to stay sharp in the loupe. The label
   beside it names the link, so alt is empty. */
function Avatar() {
  return (
    <span className="site-avatar">
      <Image src="/images/avatar-laurens.jpg" alt="" width={80} height={80} priority />
    </span>
  );
}

/**
 * A magnifying glass over the name, on desktop with a mouse. Pointing at the avatar lifts it off
 * as a lens: it widens from the avatar's own circle to 88px and its magnification from 1x to 3x on
 * one critically damped spring, so the first frame is the avatar exactly and nothing pops. Then it
 * follows the pointer along the pill, a few hundredths of a second behind like something held,
 * and shows what is under its centre: the face, the name. It rides the pill's line, giving only a
 * few pixels when the hand drifts above, below or past the ends, so it never shows an empty
 * page. Leaving runs the same
 * spring back, so the lens shrinks into the avatar where it came from. Every frame is written
 * straight to the two elements' styles; React renders the markup once.
 *
 * The zones are sized to the lens, not the 24px avatar: it wakes within 20px of the avatar's
 * centre, and while it is out the pill reaches 20px above and below and 16px either side (site.css),
 * so a hand drifting off the 36px pill doesn't drop a lens that is still under it. That reach is
 * part of the link, so it is also where the cursor stays hidden and where a click still goes home.
 */
function useLoupe(
  root: React.RefObject<HTMLDivElement | null>,
  lens: React.RefObject<HTMLDivElement | null>,
  view: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const rootEl = root.current;
    const lensEl = lens.current;
    const viewEl = view.current;
    const pill = rootEl?.querySelector<HTMLElement>(":scope > .ui-island-pill");
    const avatar = pill?.querySelector<HTMLElement>(".site-avatar");
    if (!rootEl || !lensEl || !viewEl || !pill || !avatar) return;

    const allowed = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (width > 45rem) and (prefers-reduced-motion: no-preference)",
    );

    let target = 0; // 1 while the lens is out
    let t = 0; // its progress, 0 = the avatar, 1 = the full loupe
    let speed = 0;
    let pointer = { x: 0, y: 0 }; // in the corner's own coordinates
    let held = { x: 0, y: 0 }; // where the hand has the lens, trailing the pointer
    let raf = 0;
    let last = 0;

    // The corner's own coordinates, unscaled: a press shrinks the corner, lens and all (site.css),
    // and the lens is laid out inside it, so screen points are scaled back before they're used.
    const box = () => {
      const r = rootEl.getBoundingClientRect();
      return { left: r.left, top: r.top, k: rootEl.offsetWidth / r.width, width: rootEl.offsetWidth };
    };
    type Box = ReturnType<typeof box>;
    const local = (b: Box, x: number, y: number) => ({ x: (x - b.left) * b.k, y: (y - b.top) * b.k });
    const home = (b: Box) => {
      const a = avatar.getBoundingClientRect();
      return local(b, a.left + a.width / 2, a.top + a.height / 2);
    };
    const place = (e: PointerEvent) => {
      pointer = local(box(), e.clientX, e.clientY);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Critically damped: it arrives without overshoot. Out a touch quicker than in.
      const w = target ? 14 : 17;
      speed += (w * w * (target - t) - 2 * w * speed) * dt;
      t = Math.min(1, Math.max(0, t + speed * dt));

      // The hand: eases toward the pointer along the pill, from the avatar's centre to the end of
      // the name, giving a few pixels past those ends and off the pill's line like a rubber band,
      // so the lens stays over what there is to see. Kept a little way inside the window.
      const b = box();
      const h = home(b);
      const min = local(b, LENS / 2 + EDGE, LENS / 2 + EDGE);
      const goal = {
        x: Math.max(band(pointer.x, h.x, b.width - 12, 8), min.x),
        y: Math.max(band(pointer.y, h.y, h.y, 6), min.y),
      };
      const follow = 1 - Math.exp(-dt / 0.055);
      held = { x: held.x + (goal.x - held.x) * follow, y: held.y + (goal.y - held.y) * follow };

      const x = h.x + (held.x - h.x) * t;
      const y = h.y + (held.y - h.y) * t;
      const d = 24 + (LENS - 24) * t;
      const m = 1 + (ZOOM - 1) * t;

      lensEl.style.width = lensEl.style.height = `${d}px`;
      lensEl.style.transform = `translate3d(${x - d / 2}px, ${y - d / 2}px, 0)`;
      lensEl.style.setProperty("--t", t.toFixed(4));
      viewEl.style.transform = `translate3d(${d / 2 - x * m}px, ${d / 2 - y * m}px, 0) scale(${m})`;

      if (!target && t < 0.002 && Math.abs(speed) < 0.01) {
        t = 0;
        speed = 0;
        rootEl.removeAttribute("data-loupe");
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      rootEl.setAttribute("data-loupe", "");
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      place(e);
      if (target || e.pointerType !== "mouse" || !allowed.matches) return;
      const h = home(box());
      if (Math.hypot(pointer.x - h.x, pointer.y - h.y) > REACH) return;
      if (t === 0) held = { x: band(pointer.x, h.x, box().width - 12, 8), y: band(pointer.y, h.y, h.y, 6) };
      target = 1;
      rootEl.setAttribute("data-loupe-held", "");
      run();
    };
    const leave = () => {
      if (!target) return;
      target = 0;
      rootEl.removeAttribute("data-loupe-held");
      run();
    };

    pill.addEventListener("pointermove", move);
    pill.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    allowed.addEventListener("change", leave);
    return () => {
      cancelAnimationFrame(raf);
      pill.removeEventListener("pointermove", move);
      pill.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      allowed.removeEventListener("change", leave);
    };
  }, [root, lens, view]);
}

/** Past either end of lo to hi, v gives way less and less, never more than `give`: a rubber band. */
function band(v: number, lo: number, hi: number, give: number) {
  if (v < lo) return lo - give * Math.tanh((lo - v) / give);
  if (v > hi) return hi + give * Math.tanh((v - hi) / give);
  return v;
}

/**
 * "work with me" in the header, fixed left of the menu and level with it. Above 45rem only: on
 * phones it's the menu's last row instead.
 */
export function HeaderBookCall() {
  return (
    <div className="header-book">
      <BookCall className="header-book__pill" shortcut="w" />
    </div>
  );
}
