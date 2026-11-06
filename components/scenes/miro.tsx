"use client";

import Image from "next/image";
import { Avatar, Badge, Bar, Menu, Popover, Spinner, Stage, States, Window, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./miro.css";

/*
 * Miro: a table on a board, its Theme column filled in by AI. The story is what the system does:
 * someone asks for themes from the column's menu, every cell works for a beat, then the themes
 * land row by row. AI shows as what it does (a filled column), never as sparkles or purple
 * (Stageshow, craft.md). Real strings: the table's name, its rows and the menu item; everything
 * else on the board is filler.
 */

type Hue = "teal" | "orange" | "purple";
const ROWS: { item: string; owner: string; status: [string, "accent" | "success" | "neutral"]; theme: [string, Hue] }[] = [
  { item: "Onboarding checklist", owner: "Maya", status: ["In progress", "accent"], theme: ["Activation", "teal"] },
  { item: "Pricing page refresh", owner: "Jonas", status: ["Planned", "neutral"], theme: ["Revenue", "orange"] },
  { item: "Import from CSV", owner: "Ana", status: ["Done", "success"], theme: ["Activation", "teal"] },
  { item: "Template gallery", owner: "Sam", status: ["Planned", "neutral"], theme: ["Retention", "purple"] },
];

type Cell = "empty" | "pending" | "done";
type S = { menu: boolean; hovered: number; cells: Cell[] };

const EMPTY: S = { menu: false, hovered: -1, cells: ROWS.map(() => "empty") };
const FILLED: S = { menu: false, hovered: -1, cells: ROWS.map(() => "done") };

function ThemeChip({ theme: [label, hue] }: { theme: [string, Hue] }) {
  return (
    <span className="chip" style={{ "--chip-bg": `var(--ui-vivid-${hue}-subtle)`, "--chip-ink": `var(--ui-vivid-${hue})` } as React.CSSProperties}>
      {label}
    </span>
  );
}

function ThemeCell({ state, theme }: { state: Cell; theme: [string, Hue] }) {
  return (
    <States
      value={state}
      align="start"
      states={{
        empty: <span className="mr-empty" />,
        pending: <Spinner size={13} />,
        done: <ThemeChip theme={theme} />,
      }}
    />
  );
}

/** The table widget: a title, a header row and the rows, with the Theme column on the right. */
function Table({ s, rows = ROWS, columns = "full", fillers = [118] }: { s: S; rows?: typeof ROWS; columns?: "full" | "short"; fillers?: number[] }) {
  return (
    <div className="mr-table" data-columns={columns}>
      <div className="mr-table__title">
        <span>Launch backlog</span>
        <span className="mr-table__views">
          <span data-on="">Table</span>
          <span>Board</span>
        </span>
      </div>
      <div className="mr-row mr-row--head">
        <span>Item</span>
        {columns === "full" ? <span>Owner</span> : null}
        {columns === "full" ? <span>Status</span> : null}
        <span className="mr-theme-head" data-target="theme-head" data-cursor="pointer" data-open={s.menu || undefined}>
          Theme
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2.5 4l2.5 2.5L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="mr-row">
          {row.item ? <span className="mr-item">{row.item}</span> : <Bar w={[124, 98, 112, 86][i % 4]} h={7} r={3} tone={3} />}
          {columns === "full" ? (
            <span className="mr-owner">
              <Avatar name={row.owner} size={20} />
              <span>{row.owner}</span>
            </span>
          ) : null}
          {columns === "full" ? (
            <span>
              <Badge tone={row.status[1]}>{row.status[0]}</Badge>
            </span>
          ) : null}
          <span>
            <ThemeCell state={s.cells[i] ?? "empty"} theme={row.theme} />
          </span>
        </div>
      ))}
      {fillers.map((w) => (
        <div key={w} className="mr-row mr-row--filler">
          <Bar w={w} h={7} r={3} tone={2} />
          {columns === "full" ? <Bar w={56} h={7} r={3} tone={2} /> : null}
          {columns === "full" ? <Bar w={64} h={7} r={3} tone={2} /> : null}
          <Bar w={52} h={7} r={3} tone={2} />
        </div>
      ))}
    </div>
  );
}

function ThemeMenu({ s }: { s: S }) {
  return (
    <Popover show={s.menu} origin="top left" className="mr-menu">
      <Menu items={["Sort A to Z", "Suggest themes", "Clear column"]} value={s.hovered} targets={[undefined, "suggest", "clear"]} />
    </Popover>
  );
}

/** Fill the column: every cell works, then the themes land top to bottom. */
async function fill(a: Act<S>) {
  a.put((s) => ({ cells: s.cells.map(() => "pending" as Cell) }));
  await a.wait(900);
  for (let i = 0; i < ROWS.length; i++) {
    a.put((s) => ({ cells: s.cells.map((c, j) => (j === i ? "done" : c)) }));
    await a.wait(170);
  }
}

const rest = (layout: string) => (layout === "compact" ? { x: 300, y: 290 } : { x: 1010, y: 610 });

async function heroScript(a: Act<S>) {
  await a.wait(900);
  a.mark("menu");
  // Pressed on the chevron, off the label's words.
  await a.click({ at: "theme-head", x: 0.86, y: 0.5 });
  a.put({ menu: true });
  await a.wait(450);
  await a.move("suggest");
  a.put({ hovered: 1 });
  await a.wait(250);
  await a.click("suggest");
  a.put({ menu: false, hovered: -1 });
  await a.move(rest(a.layout), { duration: 700 });
  a.mark("fill");
  await fill(a);
  await a.wait(2200);
  // The reset has its cause on screen: the same menu clears the column, bottom row first.
  a.mark("clear");
  await a.click({ at: "theme-head", x: 0.86, y: 0.5 });
  a.put({ menu: true });
  await a.wait(400);
  await a.move("clear");
  a.put({ hovered: 2 });
  await a.wait(220);
  await a.click("clear");
  a.put({ menu: false, hovered: -1 });
  for (let i = ROWS.length - 1; i >= 0; i--) {
    a.put((s) => ({ cells: s.cells.map((c, j) => (j === i ? "empty" : c)) }));
    await a.wait(70);
  }
  await a.move(rest(a.layout), { duration: 700 });
  await a.wait(300);
}

function Board({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-board">
      <div className="mr-name">
        <Image src="/logos/miro.png" alt="" width={20} height={20} />
        <span>Q3 planning</span>
      </div>
      <div className="mr-tools" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="mr-tool" data-on={i === 0 || undefined} />
        ))}
      </div>
      {children}
    </div>
  );
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 320 }}
      initial={EMPTY}
      poster={FILLED}
      script={still ? undefined : heroScript}
      cursor={still ? undefined : { at: { wide: rest("wide"), compact: rest("compact") } }}
      fill
      className="scene mr"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <div className="mr-compact">
            <Table s={s} rows={ROWS} columns="short" fillers={[118, 92]} />
            <ThemeMenu s={s} />
          </div>
        ) : (
          <Window url="miro.com/app/board/q3-planning" className="mr-window">
            <Board>
              <div className="mr-stickies" aria-hidden>
                <span className="mr-sticky" style={{ left: 0, top: 0 }}>
                  <Bar w={70} h={6} r={3} tone={4} />
                  <Bar w={48} h={6} r={3} tone={4} />
                </span>
                <span className="mr-sticky" style={{ left: 118, top: 26 }}>
                  <Bar w={62} h={6} r={3} tone={4} />
                  <Bar w={74} h={6} r={3} tone={4} />
                </span>
                <span className="mr-sticky mr-sticky--blue" style={{ left: 40, top: 138 }}>
                  <Bar w={58} h={6} r={3} tone={4} />
                  <Bar w={40} h={6} r={3} tone={4} />
                </span>
              </div>
              <div className="mr-place">
                <Table s={s} />
                <ThemeMenu s={s} />
              </div>
            </Board>
          </Window>
        )
      }
    </Stage>
  );
}

async function coverScript(a: Act<S>) {
  await a.wait(250);
  await fill(a);
  await a.wait(1600);
}

/** The card: the table hung from the top-right corner, its themes filling in while hovered. */
function Cover({ still }: SceneProps) {
  return (
    <Stage<S> width={440} height={550} initial={EMPTY} poster={FILLED} script={still ? undefined : coverScript} play="hover" className="scene mr">
      {(s) => (
        <div className="mr-cover">
          <Table s={s} rows={ROWS} columns="short" />
        </div>
      )}
    </Stage>
  );
}

/** Close-up of the column menu, one click from a filled column. The rows under the open menu are
    filler, so it covers no real words. */
const QUIET_ROWS = ROWS.map((row) => ({ ...row, item: "" }));

function Cell() {
  const s: S = { menu: true, hovered: 1, cells: ROWS.map(() => "empty") };
  return (
    <Stage<S> width={640} height={520} initial={s} fill className="scene mr">
      {() => (
        <div className="mr-close">
          <Table s={s} rows={QUIET_ROWS} columns="short" fillers={[118, 92]} />
          <ThemeMenu s={s} />
        </div>
      )}
    </Stage>
  );
}

const GROUPS: { theme: [string, Hue]; items: string[]; bars: number[] }[] = [
  { theme: ["Activation", "teal"], items: ["Onboarding checklist", "Import from CSV"], bars: [] },
  { theme: ["Revenue", "orange"], items: ["Pricing page refresh"], bars: [96] },
  { theme: ["Retention", "purple"], items: ["Template gallery"], bars: [84, 108] },
];

/** The same rows as a board, grouped by the themes the AI suggested. */
function Views() {
  return (
    <Stage width={640} height={520} fill className="scene mr">
      {() => (
        <div className="mr-kanban">
          {GROUPS.map((group) => (
            <div key={group.theme[0]} className="mr-lane">
              <div className="mr-lane__head">
                <ThemeChip theme={group.theme} />
                <span className="mr-lane__count">{group.items.length + group.bars.length}</span>
              </div>
              {group.items.map((item) => (
                <div key={item} className="mr-card">
                  <span>{item}</span>
                  <Bar w={64} h={6} r={3} tone={2} />
                </div>
              ))}
              {group.bars.map((w) => (
                <div key={w} className="mr-card">
                  <Bar w={w} h={7} r={3} tone={3} />
                  <Bar w={52} h={6} r={3} tone={2} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Stage>
  );
}

export const miroScenes = {
  "miro-cover": Cover,
  "miro-hero": Hero,
  "miro-cell": Cell,
  "miro-views": Views,
};
