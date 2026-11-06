"use client";

import { Bar, Card, Check, Count, Phone, Roll, Stage, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./meal-planner.css";

/*
 * The meal planner: a week of dinners on a phone. The story is how it feels to use: tap the swap
 * on Wednesday and a new dinner rolls in, its time with it, and the shopping list beside the phone
 * follows a beat later. Real strings: the week, its dinners, their times and the list.
 */

type Meal = { day: string; name: string; minutes: number };

const WEEK: Meal[] = [
  { day: "Mon", name: "Lemon orzo with peas", minutes: 25 },
  { day: "Tue", name: "Miso salmon bowls", minutes: 20 },
  { day: "Wed", name: "Chickpea curry", minutes: 35 },
  { day: "Thu", name: "Crispy tofu tacos", minutes: 25 },
  { day: "Fri", name: "Pizza with friends", minutes: 40 },
  { day: "Sat", name: "Slow-cooked ragu", minutes: 90 },
  { day: "Sun", name: "Soup and good bread", minutes: 30 },
];
const SWAP = 2;
const SWAPPED: Meal = { day: "Wed", name: "Shakshuka", minutes: 20 };

type S = { swapped: boolean; pressed: boolean; items: number };
const START: S = { swapped: false, pressed: false, items: 14 };
const AFTER: S = { swapped: true, pressed: false, items: 11 };

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M3 6h9.2M10 3.5 12.5 6 10 8.5M13 10H3.8M6 7.5 3.5 10 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MealRow({ meal, s, swap }: { meal: Meal; s: S; swap?: boolean }) {
  const shown = swap && s.swapped ? SWAPPED : meal;
  return (
    <div className="mp-row" data-swap={swap || undefined}>
      <span className="mp-day">{meal.day}</span>
      <span className="mp-text">
        <span className="mp-name">{swap ? <Roll>{shown.name}</Roll> : shown.name}</span>
        <span className="mp-time">{swap ? <Roll>{`${shown.minutes} min`}</Roll> : `${shown.minutes} min`}</span>
      </span>
      {swap ? (
        <span className="mp-swap" data-target="swap" data-pressed={s.pressed || undefined} aria-hidden>
          <SwapIcon />
        </span>
      ) : null}
    </div>
  );
}

/** The app's week screen, in iOS points inside the kit's Phone. */
function Week({ s }: { s: S }) {
  return (
    <div className="mp-screen">
      <div className="mp-head">
        <span className="mp-eyebrow">November 9 to 13</span>
        <span className="mp-title">This week</span>
      </div>
      <div className="mp-list">
        {WEEK.map((meal, i) => (
          <MealRow key={meal.day} meal={meal} s={s} swap={i === SWAP} />
        ))}
      </div>
      <div className="mp-tabs" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="mp-tab" data-on={i === 0 || undefined} />
        ))}
      </div>
    </div>
  );
}

const LIST = [
  { name: "Eggs", done: true },
  { name: "Feta", done: true },
  { name: "Chopped tomatoes", done: false },
  { name: "Coriander", done: false },
];
/* The rest of the week's list, for the close-up. */
const MORE = [
  { name: "Lemons", done: true },
  { name: "Orzo", done: false },
  { name: "Corn tortillas", done: false },
];

function ShoppingList({ s, full }: { s: S; full?: boolean }) {
  return (
    <Card pad="large" gap={14} lift className="mp-list-card">
      <div className="mp-card-head">
        <span className="mp-card-title">Shopping list</span>
        <span className="mp-count">
          <Count value={s.items} /> items
        </span>
      </div>
      <div className="mp-checks">
        {(full ? [...LIST, ...MORE] : LIST).map((item) => (
          <span key={item.name} className="mp-check" data-done={item.done || undefined}>
            <Check on={item.done} size={18} />
            <span>{item.name}</span>
          </span>
        ))}
        <span className="mp-check">
          <Check on={false} size={18} />
          <Bar w={84} h={7} r={3} tone={3} />
        </span>
      </div>
    </Card>
  );
}

const LOVES: { label: string; hue: string }[] = [
  { label: "Spicy", hue: "red" },
  { label: "Pasta", hue: "yellow" },
  { label: "Fish twice a week", hue: "blue" },
];
const SKIPS: { label: string; hue: string }[] = [
  { label: "Mushrooms", hue: "gray" },
  { label: "Olives", hue: "gray" },
];

function Chips({ items }: { items: { label: string; hue: string }[] }) {
  return (
    <div className="mp-chips">
      {items.map((taste) => (
        <span key={taste.label} className="chip" style={{ "--chip-bg": `var(--ui-vivid-${taste.hue}-subtle)`, "--chip-ink": `var(--ui-vivid-${taste.hue})` } as React.CSSProperties}>
          {taste.label}
        </span>
      ))}
    </div>
  );
}

/** What the planner plans from. `full` adds what you skip and who you cook for (the close-up). */
function Tastes({ full }: { full?: boolean }) {
  return (
    <Card pad="large" gap={16} lift className="mp-taste-card">
      <span className="mp-card-title">What you like</span>
      <Chips items={LOVES} />
      {full ? (
        <>
          <div className="mp-section">
            <span className="mp-label">Skip</span>
            <Chips items={SKIPS} />
          </div>
          <div className="mp-section">
            <span className="mp-label">Cooking for</span>
            <span className="mp-value">Two adults and a toddler</span>
          </div>
          <div className="mp-section">
            <span className="mp-label">Weeknights</span>
            <span className="mp-value">Under 30 minutes</span>
          </div>
        </>
      ) : null}
    </Card>
  );
}

async function swapScript(a: Act<S>, withList: boolean) {
  await a.wait(900);
  a.mark("tap");
  await a.click("swap");
  a.put({ pressed: true });
  await a.wait(140);
  a.put({ pressed: false, swapped: true });
  if (withList) {
    await a.wait(380);
    a.put({ items: 11 });
  }
  await a.wait(2600);
  // The cause of the return is on screen too: a second tap swaps the curry back in.
  a.mark("back");
  await a.click("swap");
  a.put({ pressed: true });
  await a.wait(140);
  a.put({ pressed: false, swapped: false });
  if (withList) {
    await a.wait(380);
    a.put({ items: 14 });
  }
  await a.wait(1400);
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 420 }}
      initial={START}
      poster={AFTER}
      script={still ? undefined : (a) => swapScript(a, a.layout === "wide")}
      cursor={still ? undefined : { at: { wide: { x: 700, y: 560 }, compact: { x: 300, y: 380 } }, style: "touch" }}
      fill
      className="scene mp"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <Phone width={300} className="mp-phone mp-phone--compact">
            <Week s={s} />
          </Phone>
        ) : (
          <>
            <div className="mp-hero-tastes">
              <Tastes />
            </div>
            <Phone width={340} className="mp-phone mp-phone--hero">
              <Week s={s} />
            </Phone>
            <div className="mp-hero-list">
              <ShoppingList s={s} />
            </div>
          </>
        )
      }
    </Stage>
  );
}

async function coverScript(a: Act<S>) {
  await a.wait(300);
  a.put({ pressed: true });
  await a.wait(140);
  a.put({ pressed: false, swapped: true });
  await a.wait(1800);
}

/** The card: the phone hung from the top-right, its top cropped inside the list. */
function Cover({ still }: SceneProps) {
  return (
    <Stage<S> width={440} height={550} initial={START} poster={START} script={still ? undefined : coverScript} play="hover" className="scene mp">
      {(s) => (
        <Phone width={260} className="mp-phone mp-phone--cover">
          <Week s={s} />
        </Phone>
      )}
    </Stage>
  );
}

/** What it plans from: the tastes, close up, off the bottom. */
function Taste() {
  return (
    <Stage width={640} height={520} fill className="scene mp">
      {() => (
        <div className="mp-close">
          <Tastes full />
        </div>
      )}
    </Stage>
  );
}

/** What it hands you: the week's shopping list, off the bottom. */
function List() {
  return (
    <Stage<S> width={640} height={520} initial={AFTER} fill className="scene mp">
      {(s) => (
        <div className="mp-close mp-close--list">
          <ShoppingList s={s} full />
        </div>
      )}
    </Stage>
  );
}

export const mealPlannerScenes = {
  "meal-planner-cover": Cover,
  "meal-planner-hero": Hero,
  "meal-planner-swap": Taste,
  "meal-planner-list": List,
};
