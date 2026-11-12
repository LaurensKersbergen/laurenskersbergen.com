import type { VividHue } from "@/kit/ui/vivid";

/**
 * The last ten years, newest first. `from` and `to` are years as decimals; where only the year is
 * known, a change of job sits mid-year. `to: null` is still going. `href` links a row to its project.
 * The years come from Laurens's earlier sites (KPN 2018 to 2021, Growth Tribe 2021 to 2022, Miro
 * since 2022). Side projects go back further than the window, to before 2018 with no exact start:
 * any `from` before the first year draws the bar fading in from the left edge.
 */
export interface TimelineEntry {
  name: string;
  role: string;
  /** What the bar says, in words: no dashes. */
  label: string;
  from: number;
  to: number | null;
  color: VividHue;
  href?: string;
}

export const timeline: TimelineEntry[] = [
  { name: "Side projects", role: "Lately Hori, a meal planner and this site", label: "Since before 2018", from: 2015, to: null, color: "orange", href: "/projects/meal-planner" },
  { name: "Miro", role: "Product manager, databases and AI", label: "Since 2022", from: 2022.5, to: null, color: "yellow", href: "/projects/miro" },
  { name: "Growth Tribe", role: "Product manager", label: "2021 to 2022", from: 2021.5, to: 2022.5, color: "purple", href: "/projects/growth-tribe" },
  { name: "KPN", role: "Marketing, then product for growth", label: "2018 to 2021", from: 2018, to: 2021.5, color: "green", href: "/projects/kpn" },
];

/** How many years the timeline spans, this one included. */
export const TIMELINE_SPAN = 10;

/** The years along the top: the nine full years back from this one, and this one. */
export function timelineYears(now: Date) {
  const current = now.getFullYear();
  return Array.from({ length: TIMELINE_SPAN }, (_, i) => current - TIMELINE_SPAN + 1 + i);
}

/** Where `year` falls across the window of `years`, from 0 at its start to 1 at its end, clamped. */
export function position(year: number, years: number[]) {
  const start = years[0];
  const end = years[years.length - 1] + 1;
  return Math.min(1, Math.max(0, (year - start) / (end - start)));
}
