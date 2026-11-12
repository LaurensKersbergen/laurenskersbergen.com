"use client";

import { tagColor } from "@kit/ui";
import { vividHues } from "@/kit/ui/vivid";
import { Bar, Stage, Window, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./this-site.css";
import { ground } from "@/lib/ground";

/*
 * This site: its homepage in a browser, and the floating island menu in the corner opening on the
 * kit's own springs (wider on the x spring, taller on the y spring, the links fading in from the
 * toggle down), then closing again from its own toggle. Real strings: the name pill, the intro's
 * first line, the cards' titles and the menu.
 */

const LINKS = ["home", "projects", "about", "listening"];
type S = { open: boolean; hovered: number };
const CLOSED: S = { open: false, hovered: -1 };
const OPEN: S = { open: true, hovered: 1 };

function Island({ s }: { s: S }) {
  return (
    <div className="ts-island" data-open={s.open || undefined}>
      <div className="ts-island__inner">
        <span className="ts-island__trigger" data-target="toggle" data-cursor="pointer">
          {s.open ? "close" : "menu"}
        </span>
        <div className="ts-island__list">
          {LINKS.map((link, i) => (
            <span
              key={link}
              className="ts-island__link"
              data-current={i === 0 || undefined}
              data-on={s.hovered === i || undefined}
              data-target={`link-${i}`}
              style={{ "--i": i + 1 } as React.CSSProperties}
            >
              {link}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const CARDS: { title: string; hue: string; w: number }[] = [
  { title: "Miro", hue: "yellow", w: 112 },
  { title: "Meal planner", hue: "orange", w: 96 },
  { title: "This site", hue: "blue", w: 120 },
  { title: "Growth Tribe", hue: "purple", w: 88 },
];

/** The homepage in miniature: the name pill, the intro, the carousel running off the right. */
function Home({ s }: { s: S }) {
  return (
    <div className="ts-page">
      <span className="ts-pill">laurens</span>
      <Island s={s} />
      <div className="ts-intro">
        <span>Laurens Kersbergen, product manager in Amsterdam.</span>
        <span className="ts-intro__bars" aria-hidden>
          <Bar w={300} h={18} r={6} tone={2} />
          <Bar w={180} h={18} r={6} tone={2} />
        </span>
      </div>
      <div className="ts-cards">
        {CARDS.map((card) => (
          <div key={card.title} className="ts-card" style={{ background: ground(card.hue) }}>
            <span className="ts-card__art">
              <Bar w={92} h={6} r={3} tone={3} />
              <Bar w={64} h={6} r={3} tone={2} />
              <Bar w={78} h={6} r={3} tone={2} />
            </span>
            <span className="ts-card__copy">
              <span className="ts-card__title">{card.title}</span>
              <Bar w={card.w} h={6} r={3} tone={3} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function menuScript(a: Act<S>) {
  await a.wait(900);
  a.mark("open");
  await a.click({ at: "toggle", x: 1.25, y: 0.5 });
  a.put({ open: true });
  await a.wait(700);
  await a.move("link-1");
  a.put({ hovered: 1 });
  await a.wait(1600);
  a.put({ hovered: -1 });
  a.mark("close");
  await a.click({ at: "toggle", x: 1.25, y: 0.5 });
  a.put({ open: false });
  await a.wait(900);
  await a.move(a.layout === "compact" ? { x: 250, y: 300 } : { x: 900, y: 560 }, { duration: 700 });
  await a.wait(300);
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 420 }}
      initial={CLOSED}
      poster={OPEN}
      script={still ? undefined : menuScript}
      cursor={still ? undefined : { at: { wide: { x: 900, y: 560 }, compact: { x: 250, y: 300 } } }}
      fill
      className="scene ts"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <div className="ts-compact">
            <Home s={s} />
          </div>
        ) : (
          <Window url="laurenskersbergen.com" className="ts-window">
            <Home s={s} />
          </Window>
        )
      }
    </Stage>
  );
}

async function coverScript(a: Act<S>) {
  await a.wait(250);
  a.put({ open: true });
  await a.wait(500);
  a.put({ hovered: 1 });
  await a.wait(1800);
}

/** The card: the corner of the homepage where the menu lives, its frosted island opening over the
    vivid cards while hovered. Real words: the name pill and the menu. */
function Cover({ still }: SceneProps) {
  return (
    <Stage<S> width={440} height={550} initial={CLOSED} poster={CLOSED} script={still ? undefined : coverScript} play="hover" className="scene ts">
      {(s) => (
        <div className="ts-cover">
          <span className="ts-pill ts-cover__pill">laurens</span>
          <div className="ts-cover__tiles" aria-hidden>
            {["yellow", "orange", "blue", "purple"].map((hue) => (
              <span key={hue} className="ts-cover__tile" style={{ background: ground(hue) }}>
                <span className="ts-cover__art" />
              </span>
            ))}
          </div>
          <Island s={s} />
        </div>
      )}
    </Stage>
  );
}

const TAGS = ["Product management", "Databases", "AI", "Side project", "Design and build", "Design system", "Growth", "Marketing", "Learning", "Zero to one"];

/** The tags this site uses, each in the vivid hue its name gives it, and the twelve hues. */
function Tags() {
  return (
    <Stage width={640} height={520} fill className="scene ts">
      {() => (
        <div className="ts-tags">
          <span className="ts-tags__title">Tags</span>
          <div className="ts-tags__row">
            {TAGS.map((tag) => {
              const hue = tagColor(tag);
              return (
                <span key={tag} className="chip ts-tag" style={{ "--chip-bg": `var(--ui-vivid-${hue}-subtle)`, "--chip-ink": `var(--ui-vivid-${hue})` } as React.CSSProperties}>
                  {tag}
                </span>
              );
            })}
          </div>
          <span className="ts-tags__title">Timeline</span>
          <div className="ts-bars">
            {[
              ["yellow", 0.3, 0.97],
              ["purple", 0.08, 0.3],
              ["green", 0, 0.08],
            ].map(([hue, from, to]) => (
              <span key={hue as string} className="ts-bar-lane">
                <span className="ts-bar" style={{ "--from": from, "--to": to, background: `var(--ui-vivid-${hue}-mild)` } as React.CSSProperties} />
              </span>
            ))}
          </div>
          <span className="ts-tags__title">Twelve vivid hues</span>
          <div className="ts-swatches">
            {vividHues.map((hue) => (
              <span key={hue} className="ts-swatch" style={{ "--a": `var(--ui-vivid-${hue}-mild)`, "--b": `var(--ui-vivid-${hue})` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
    </Stage>
  );
}

/** The menu open, close up, over a soft page. */
function IslandClose() {
  return (
    <Stage<S> width={640} height={520} initial={OPEN} fill className="scene ts">
      {() => (
        <div className="ts-island-close">
          <div className="ts-island-close__page" aria-hidden>
            <Bar w={260} h={22} r={7} tone={2} />
            <Bar w={200} h={22} r={7} tone={2} />
            <span className="ts-island-close__tile" />
          </div>
          <Island s={OPEN} />
        </div>
      )}
    </Stage>
  );
}

export const thisSiteScenes = {
  "this-site-cover": Cover,
  "this-site-hero": Hero,
  "this-site-tags": Tags,
  "this-site-island": IslandClose,
};
