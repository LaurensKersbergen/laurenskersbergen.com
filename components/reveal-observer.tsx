"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

let firstRoute = true;

/** When site.css shows every block anyway, in case this never runs. */
const REVEAL_FALLBACK_MS = 1500;

/**
 * Marks every [data-reveal] element with data-in once a little of it is in view, so its entrance
 * in site.css plays as it scrolls in (the timeline's bars grow the same way). Mounted once in the
 * layout; it looks again after every route change. Elements already in view on load come in at
 * once, staggered by their own --reveal-delay, and have settled by the time the intro's logos
 * arrive (1.4s in).
 *
 * After the first route change it also marks <html data-intro-seen>: the intro's logos fly in on
 * a full load, not again each time someone comes back to the homepage.
 *
 * It also marks <html data-reveal-ready>, which stands down site.css's fallback: without it, every
 * block comes in by itself 1.5s after load, so content never depends on this script.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!firstRoute) document.documentElement.setAttribute("data-intro-seen", "");
    firstRoute = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const frame = requestAnimationFrame(() => {
      // Starting after site.css's 1.5s fallback has already shown everything: keep it shown
      // rather than hide it again to replay the entrance.
      if (!document.documentElement.hasAttribute("data-reveal-ready") && performance.now() > REVEAL_FALLBACK_MS) {
        document.querySelectorAll("[data-reveal]").forEach((element) => element.setAttribute("data-in", ""));
      }
      document.documentElement.setAttribute("data-reveal-ready", "");
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((element) => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
