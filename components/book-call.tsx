"use client";

import { getCalApi } from "@calcom/embed-react";
import type { MouseEvent, ReactNode } from "react";
import { Kbd } from "@/components/kbd";
import { calLink, email } from "@/lib/site";

const NAMESPACE = "work-with-me";
/* "auto": the booking popup follows the system, as the page does. */
const CONFIG = { layout: "month_view", theme: "auto" } as const;

/** Where the button goes: the Cal.com event, or until it's set, an email. */
export const bookingHref = calLink ? `https://cal.com/${calLink}` : `mailto:${email}?subject=${encodeURIComponent("Working together")}`;

/* Cal's embed script (about 100kB) loads on the first sign of intent, not with the page: hovering,
   focusing or touching the button. By the click it has usually loaded, and it has prerendered the
   booking page, so the popup opens with the calendar already in it. */
let calReady: ReturnType<typeof getCalApi> | null = null;

function loadCal() {
  calReady ??= getCalApi({ namespace: NAMESPACE }).then((cal) => {
    cal("ui", {
      theme: "auto",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": "#111111" }, dark: { "cal-brand": "#ffffff" } },
    });
    cal("preload", { calLink });
    return cal;
  });
  return calReady;
}

async function open(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  const cal = await loadCal();
  cal("modal", { calLink, config: CONFIG });
}

/**
 * "work with me": books a call in Cal.com's popup, over the page, so nobody leaves the site to do
 * it. A modified click (to open a new tab) and a visit without scripts follow the real cal.com
 * link instead. Until calLink is set it writes an email, so it already works. It takes its look
 * from where it sits: the header pill, or a row of the menu (which passes its own class and label).
 * With a `shortcut` (W), the key presses it (components/keyboard-shortcuts.tsx) and a hint shows it.
 */
export function BookCall({ className, children = "work with me", shortcut }: { className?: string; children?: ReactNode; shortcut?: string }) {
  const keys = shortcut ? { "data-shortcut": shortcut, "aria-keyshortcuts": shortcut.toUpperCase() } : {};
  const content = (
    <>
      {children}
      {shortcut ? <Kbd>{shortcut}</Kbd> : null}
    </>
  );

  if (!calLink) {
    return (
      <a href={bookingHref} className={className} {...keys}>
        {content}
      </a>
    );
  }

  return (
    <a href={bookingHref} aria-haspopup="dialog" className={className} {...keys} onPointerEnter={loadCal} onFocus={loadCal} onTouchStart={loadCal} onClick={open}>
      {content}
    </a>
  );
}
