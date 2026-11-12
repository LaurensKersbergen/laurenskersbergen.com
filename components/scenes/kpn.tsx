"use client";

import { Bar, Button, Meter, Roll, Stage, Window, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./kpn.css";

/*
 * KPN.com: choosing an internet speed, the kind of high-traffic flow growth work lives in. The
 * story is how it feels to use: pick a faster speed and the order summary follows a beat later,
 * its speed rolling and its meter filling. Picking the first one again is the loop's way back, so
 * the return has a cause. Dutch, as the site is. No prices: the picture is the flow, not an offer.
 */

const SPEEDS = [
  { speed: "100 Mbit/s", short: "100 Mbit/s", fill: 0.18, line: 108 },
  { speed: "1 Gbit/s", short: "1 Gbit/s", fill: 0.55, line: 124, popular: true },
  { speed: "4 Gbit/s", short: "4 Gbit/s", fill: 0.94, line: 96 },
];

type S = { picked: number; summary: number };
const START: S = { picked: 0, summary: 0 };
const PICKED: S = { picked: 1, summary: 1 };

function Option({ i, s }: { i: number; s: S }) {
  const option = SPEEDS[i];
  return (
    <div className="kp-option" data-picked={s.picked === i || undefined} data-target={`option-${i}`} data-cursor="pointer">
      <span className="kp-radio" />
      <span className="kp-option__speed">{option.speed}</span>
      {option.popular ? <span className="kp-badge">Populair</span> : null}
      <Bar w={option.line} h={7} r={3} tone={2} />
      <Bar w={option.line - 30} h={7} r={3} tone={2} />
    </div>
  );
}

function Summary({ s }: { s: S }) {
  const option = SPEEDS[s.summary];
  return (
    <div className="kp-summary">
      <span className="kp-summary__title">Jouw pakket</span>
      <span className="kp-summary__line">
        <span>Internet</span>
        <span className="kp-summary__speed">
          <Roll align="end">{option.short}</Roll>
        </span>
      </span>
      <Meter value={option.fill} className="kp-meter" />
      <span className="kp-summary__rows">
        <Bar w={132} h={7} r={3} tone={2} />
        <Bar w={96} h={7} r={3} tone={2} />
      </span>
      <Button variant="primary" size="large" className="kp-order">
        Bestellen
      </Button>
    </div>
  );
}

function Page({ s }: { s: S }) {
  return (
    <div className="kp-page">
      <div className="kp-nav" aria-hidden>
        <span className="kp-logo">KPN</span>
        <Bar w={54} h={7} r={3} tone={3} />
        <Bar w={62} h={7} r={3} tone={3} />
        <Bar w={48} h={7} r={3} tone={3} />
      </div>
      <div className="kp-body">
        <div>
          <span className="kp-title">Kies je snelheid</span>
          <div className="kp-options">
            {SPEEDS.map((_, i) => (
              <Option key={i} i={i} s={s} />
            ))}
          </div>
          <span className="kp-subtitle">Altijd inbegrepen</span>
          <div className="kp-included" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="kp-tile">
                <span className="kp-tile__icon" />
                <Bar w={[84, 72, 92][i]} h={7} r={3} tone={3} />
                <Bar w={[60, 66, 50][i]} h={6} r={3} tone={2} />
              </span>
            ))}
          </div>
        </div>
        <Summary s={s} />
      </div>
    </div>
  );
}

const rest = (layout: string) => (layout === "compact" ? { x: 300, y: 380 } : { x: 600, y: 610 });

async function script(a: Act<S>) {
  await a.wait(900);
  a.mark("pick");
  await a.click("option-1");
  a.put({ picked: 1 });
  await a.wait(320);
  a.put({ summary: 1 });
  await a.move(rest(a.layout), { duration: 700 });
  await a.wait(2400);
  a.mark("back");
  await a.click("option-0");
  a.put({ picked: 0 });
  await a.wait(320);
  a.put({ summary: 0 });
  await a.move(rest(a.layout), { duration: 700 });
  await a.wait(500);
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 420 }}
      initial={START}
      poster={PICKED}
      script={still ? undefined : script}
      cursor={still ? undefined : { at: { wide: rest("wide"), compact: rest("compact") } }}
      fill
      className="scene kp"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <div className="kp-compact">
            <span className="kp-title">Kies je snelheid</span>
            <div className="kp-options">
              {SPEEDS.map((_, i) => (
                <Option key={i} i={i} s={s} />
              ))}
            </div>
          </div>
        ) : (
          <Window url="kpn.com/internet" className="kp-window">
            <Page s={s} />
          </Window>
        )
      }
    </Stage>
  );
}

async function coverScript(a: Act<S>) {
  await a.wait(250);
  a.put({ picked: 1 });
  await a.wait(1800);
}

/** The card: the speeds stacked, hung from the top-right, the choice moving while hovered. */
function Cover({ still }: SceneProps) {
  return (
    <Stage<S> width={440} height={550} initial={START} poster={START} script={still ? undefined : coverScript} play="hover" className="scene kp">
      {(s) => (
        <div className="kp-cover">
          <span className="kp-title">Kies je snelheid</span>
          <div className="kp-options">
            {SPEEDS.map((_, i) => (
              <Option key={i} i={i} s={s} />
            ))}
          </div>
        </div>
      )}
    </Stage>
  );
}

/** The chosen speed, close up. */
function Speed() {
  return (
    <Stage<S> width={640} height={520} initial={PICKED} fill className="scene kp">
      {(s) => (
        <div className="kp-close">
          <Option i={1} s={s} />
          <Summary s={s} />
        </div>
      )}
    </Stage>
  );
}

const VARIANTS = [
  { name: "A", label: "Huidige pagina", bars: [38, 46, 41, 52, 48, 55, 50] },
  { name: "B", label: "Snelheid eerst", bars: [44, 58, 61, 66, 70, 74, 79], leading: true },
];

/** The experiment behind a change like this: two variants, one pulling ahead. No figures. */
function Test() {
  return (
    <Stage width={640} height={520} fill className="scene kp">
      {() => (
        <div className="kp-test">
          <div className="kp-test__head">
            <span className="kp-summary__title">Experiment</span>
            <span className="kp-test__status">Loopt</span>
          </div>
          {VARIANTS.map((variant) => (
            <div key={variant.name} className="kp-variant" data-leading={variant.leading || undefined}>
              <span className="kp-variant__name">{variant.name}</span>
              <span className="kp-variant__label">{variant.label}</span>
              <span className="kp-variant__bars" aria-hidden>
                {variant.bars.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </Stage>
  );
}

export const kpnScenes = {
  "kpn-cover": Cover,
  "kpn-hero": Hero,
  "kpn-speed": Speed,
  "kpn-test": Test,
};
