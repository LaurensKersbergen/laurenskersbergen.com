"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Marks every [data-reveal] element with data-in once a little of it is in view, so its entrance
 * in site.css plays as it scrolls in (the timeline's bars grow the same way). Mounted once in the
 * layout; it looks again after every route change. Elements already in view on load come in at
 * once, staggered by their own --reveal-delay.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
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
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((element) => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
