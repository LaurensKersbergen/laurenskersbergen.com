"use client";

import { ArrowUpIcon } from "@kit/ui";

/** Back to the top of the page: smoothly, unless the visitor asked for less motion. */
export function ToTop() {
  return (
    <button
      type="button"
      className="to-top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      Back to top
      <ArrowUpIcon size={16} className="to-top__icon" />
    </button>
  );
}
