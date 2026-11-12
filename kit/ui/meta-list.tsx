import { Fragment, type ReactNode } from "react";
import { Separator } from "./avatar";
import { cn } from "./cn";
import { type CategoryColor, ProgressRing } from "./display";

/**
 * Short facts in a row with the design system's Separator between them: "Blok 10 | 2 weken te laat".
 * Use it instead of joining text with a middle dot or a dash. design-ok: names what not to do Empty items are left out; each item truncates on
 * its own. The separators are decorative, so screen readers read the facts as one sentence.
 */
export function MetaList({ items, className }: { items: ReactNode[]; className?: string }) {
  const shown = items.filter((item) => item !== null && item !== undefined && item !== false && item !== "");
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5", className)}>
      {shown.map((item, i) => (
        <Fragment key={i}>
          {i ? <Separator orientation="vertical" aria-hidden render={<span />} className="h-3 bg-line-2 data-[orientation=vertical]:self-center" /> : null}
          <span className="min-w-0 truncate">{item}</span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Where something stands and what comes next, as one line: "Oogsten | tot 31 oktober". The ring and
 * the phase are in full ink; the next step is muted, after the separator. Leave `next` out when
 * nothing follows ("Geoogst").
 */
export function PhaseLabel({ phase, value, color, next, className }: { phase: string; value: number | null; color?: CategoryColor; next?: string | null; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <ProgressRing value={value} color={color} />
      <MetaList items={[<span key="phase" className="text-ink">{phase}</span>, next]} />
    </span>
  );
}
