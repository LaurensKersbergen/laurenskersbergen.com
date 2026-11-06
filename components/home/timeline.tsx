import Link from "next/link";
import type { CSSProperties } from "react";
import { position, timeline, timelineYears } from "@/lib/timeline";

/**
 * The last five years as a row per role, each a bar in its project's vivid hue across the years,
 * laid out on a time axis. The bars grow from their start, one after
 * another, as the timeline comes into view; one that is still going ends in a breathing dot.
 */
export function Timeline() {
  const now = new Date();
  const years = timelineYears(now);
  const today = now.getFullYear() + now.getMonth() / 12;

  return (
    <section aria-labelledby="timeline-title" className="shell">
      <div className="section-head" data-reveal>
        <h2 id="timeline-title" className="section-title">
          The last five years
        </h2>
      </div>

      <div className="timeline" data-reveal style={{ "--years": years.length } as CSSProperties}>
        <div className="timeline__years" aria-hidden="true">
          {years.map((year) => (
            <span key={year} className="timeline__year" data-now={year === now.getFullYear() ? "" : undefined}>
              {year}
            </span>
          ))}
        </div>

        <ol className="timeline__rows">
          {timeline.map((entry, i) => {
            const from = position(entry.from, years);
            const to = position(entry.to ?? today, years);
            const style = {
              "--from": from,
              "--to": to,
              "--i": i,
              "--bar": `var(--ui-vivid-${entry.color}-mild)`,
              "--bar-ink": `var(--ui-vivid-${entry.color}-on-mild)`,
            } as CSSProperties;
            /* A bar too short for its words says them just past its end instead. */
            const outside = to - from < 0.12 && to < 0.8;
            const content = (
              <>
                <span className="timeline__who">
                  <span className="timeline__name">{entry.name}</span>
                  <span className="timeline__role">{entry.role}</span>
                  <span className="timeline__period">{entry.label}</span>
                </span>
                <span className="timeline__lane">
                  <span className="timeline__bar" style={style} data-clipped={entry.from < years[0] ? "" : undefined}>
                    {outside ? null : <span className="timeline__bar-label">{entry.label}</span>}
                    {entry.to === null ? <span className="timeline__live" aria-label="Ongoing" role="img" /> : null}
                  </span>
                  {outside ? (
                    <span className="timeline__bar-label timeline__bar-label--outside" style={style}>
                      {entry.label}
                    </span>
                  ) : null}
                </span>
              </>
            );
            return (
              <li key={entry.name} className="contents">
                {entry.href ? (
                  <Link href={entry.href} className="timeline__row">
                    {content}
                  </Link>
                ) : (
                  <div className="timeline__row">{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
