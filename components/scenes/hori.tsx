"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  Bell,
  Calendar,
  ChevronDown,
  CircleCheck,
  Clock,
  Maximize2,
  MapPin,
  Minus,
  PanelLeft,
  Pause,
  Play,
  Plus,
  Redo2,
  Shovel,
  Sprout,
  Undo2,
  X,
} from "lucide-react";
import { Button, Check, Collapse, Popover, Roll, Stage, States, Toast, Window, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./hori.css";

/*
 * Hori: a vegetable garden planned in 3D. Built from the app itself (github.com/LaurensKersbergen/hori,
 * its garden preview): the 3D garden is the app's own render, captured at these sizes
 * (public/images/hori), and everything around it, the task list, the season bar, the panels and
 * the canvas tools, is drawn here in the app's measurements, words and icons (lucide, as the app
 * uses). The app is Dutch, so the screens are too.
 *
 * The stories: a task opens its bed (the camera flies to Blok 6 and the task's panel comes up)
 * and is marked done; the season plays and the garden grows from bare January to August. The
 * stills: a bed's crop rotation, and the sowing calendar for the cabbages.
 */

const SRC = "/images/hori";

/* ------------------------------------------------------------------------------------------------
 * The task list: the sidebar's first tab, late tasks over this week's.
 * --------------------------------------------------------------------------------------------- */

type Task = { id: string; title: string; meta: string; late?: string; thumb?: string };

const LATE: Task[] = [
  { id: "paprika", title: "Punt paprika afoogsten", meta: "Kas", late: "2 weken te laat", thumb: "thumb-paprika" },
  { id: "pompoen", title: "Pompoenen afoogsten", meta: "Blok 4", late: "1 week te laat", thumb: "thumb-pompoen" },
  { id: "knolselderij", title: "Knolselderij afoogsten", meta: "Blok 9", late: "1 week te laat", thumb: "thumb-knolselderij" },
];

const WEEK: Task[] = [
  { id: "b11", title: "Blok 11 bemesten", meta: "2 kg per m²" },
  { id: "b6", title: "Blok 6 bemesten", meta: "2 kg per m²" },
  { id: "b4", title: "Blok 4 bemesten", meta: "4 kg per m²" },
  { id: "b1", title: "Blok 1 bemesten", meta: "3 kg per m²" },
];

const FOCUS = "b6";

type S = { selected: boolean; zoomed: boolean; panel: boolean; done: boolean; gone: boolean; toast: boolean };
const START: S = { selected: false, zoomed: false, panel: false, done: false, gone: false, toast: false };
/* The poster: the task picked, its bed in view, its panel open. */
const OPEN: S = { selected: true, zoomed: true, panel: true, done: false, gone: false, toast: false };

function TaskRow({ task, s }: { task: Task; s: S }) {
  const focus = task.id === FOCUS;
  return (
    <div className="hr-task" data-selected={(focus && s.selected) || undefined} data-target={focus ? "task" : undefined} data-cursor={focus ? "pointer" : undefined}>
      <span className="hr-task__check">
        <Check on={focus && s.done} size={16} />
      </span>
      <span className="hr-task__thumb">
        {task.thumb ? <Image src={`${SRC}/${task.thumb}.webp`} alt="" width={36} height={36} unoptimized /> : <Shovel size={16} strokeWidth={1.5} />}
      </span>
      <span className="hr-task__text">
        <span className="hr-task__title">{task.title}</span>
        <span className="hr-task__meta">
          {task.meta}
          {task.late ? (
            <>
              <span className="hr-sep" aria-hidden />
              <span className="hr-late">{task.late}</span>
            </>
          ) : null}
        </span>
      </span>
      <span className="hr-task__later" aria-hidden>
        <Clock size={16} strokeWidth={1.5} />
      </span>
    </div>
  );
}

function Section({ label, count, children }: { label: string; count: ReactNode; children: ReactNode }) {
  return (
    <div className="hr-section">
      <div className="hr-section__head">
        <span>{label}</span>
        <span className="hr-count">{count}</span>
      </div>
      {children}
    </div>
  );
}

function Sidebar({ s }: { s: S }) {
  return (
    <aside className="hr-side">
      <div className="hr-side__head">
        <span className="hr-user">
          <span className="hr-user__avatar">L</span>
          <span className="hr-user__name">Laurens</span>
          <ChevronDown size={14} strokeWidth={1.5} />
        </span>
        <span className="hr-side__icons" aria-hidden>
          <span className="hr-icon hr-icon--dot">
            <Bell size={16} strokeWidth={1.5} />
          </span>
          <span className="hr-icon">
            <PanelLeft size={16} strokeWidth={1.5} />
          </span>
        </span>
      </div>
      <div className="hr-tabs" aria-hidden>
        <span className="hr-tab" data-on="">
          <CircleCheck size={16} strokeWidth={1.5} />
          Taken
        </span>
        <span className="hr-tab">
          <Sprout size={16} strokeWidth={1.5} />
        </span>
        <span className="hr-tab">
          <Calendar size={16} strokeWidth={1.5} />
        </span>
      </div>
      <div className="hr-lists">
        <Section label="Te laat" count={LATE.length}>
          {LATE.map((task) => (
            <TaskRow key={task.id} task={task} s={s} />
          ))}
        </Section>
        <Section label="Deze week" count={<Roll>{String(WEEK.length - (s.gone ? 1 : 0))}</Roll>}>
          {WEEK.map((task) =>
            task.id === FOCUS ? (
              <Collapse key={task.id} open={!s.gone}>
                <TaskRow task={task} s={s} />
              </Collapse>
            ) : (
              <TaskRow key={task.id} task={task} s={s} />
            ),
          )}
        </Section>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The season bar: the app's top bar over the garden.
 * --------------------------------------------------------------------------------------------- */

/* The weeks the cover plays through, as the scrubber names them (week 0 to 47 of the season). */
const SEASON: { week: number; label: string }[] = [
  { week: 0, label: "1 – 7 jan" },
  { week: 6, label: "16 – 23 feb" },
  { week: 10, label: "16 – 23 mrt" },
  { week: 13, label: "8 – 15 apr" },
  { week: 16, label: "1 – 7 mei" },
  { week: 19, label: "24 – 31 mei" },
  { week: 22, label: "16 – 23 jun" },
  { week: 25, label: "8 – 15 jul" },
  { week: 28, label: "1 – 7 aug" },
];
const TODAY = { week: 40, label: "1 – 7 nov" };

function Scrubber({ week, label, playing, full }: { week: number; label: string; playing?: boolean; full?: boolean }) {
  return (
    <span className="hr-season">
      <States
        className="hr-play"
        value={playing ? "pause" : "play"}
        states={{ play: <Play size={16} strokeWidth={1.5} />, pause: <Pause size={16} strokeWidth={1.5} /> }}
        aria-hidden
      />
      <span className="hr-scrub" data-full={full || undefined} style={{ "--at": week / 47 } as CSSProperties}>
        <span className="hr-scrub__fill" />
        <span className="hr-scrub__knob" />
      </span>
      {/* The week rolls through like a counter, pinned at its start, its changed characters
          close together so a step lands before the next one. */}
      <span className="hr-week">
        <Roll align="start" stagger={18}>
          {label}
        </Roll>
      </span>
    </span>
  );
}

function TopBar({ week = TODAY.week, label = TODAY.label }: { week?: number; label?: string }) {
  return (
    <div className="hr-top">
      <span className="hr-select">
        Seizoen 2027
        <ChevronDown size={14} strokeWidth={1.5} />
      </span>
      <span className="hr-divider" aria-hidden />
      <span className="hr-seg" aria-hidden>
        <span>Boven</span>
        <span data-on="">3D</span>
      </span>
      <Scrubber week={week} label={label} full />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The canvas: the app's render, its tools and the selection's panel.
 * --------------------------------------------------------------------------------------------- */

function Tools({ zoom }: { zoom: string }) {
  return (
    <div className="hr-tools" aria-hidden>
      <span className="hr-toolgroup">
        <span className="hr-tool">
          <Minus size={16} strokeWidth={1.5} />
        </span>
        <span className="hr-zoom">
          <Roll>{zoom}</Roll>
        </span>
        <span className="hr-tool">
          <Plus size={16} strokeWidth={1.5} />
        </span>
        <span className="hr-tool hr-tool--rule" data-target="fit" data-cursor="pointer">
          <Maximize2 size={15} strokeWidth={1.5} />
        </span>
      </span>
      <span className="hr-toolgroup">
        <span className="hr-tool" data-target="undo" data-cursor="pointer">
          <Undo2 size={16} strokeWidth={1.5} />
        </span>
        <span className="hr-tool hr-tool--off">
          <Redo2 size={16} strokeWidth={1.5} />
        </span>
      </span>
    </div>
  );
}

const FACTS: { icon: ReactNode; label: string; value: string }[] = [
  { icon: <MapPin size={16} strokeWidth={1.5} />, label: "Waar", value: "Blok 6" },
  { icon: <Shovel size={16} strokeWidth={1.5} />, label: "Compost", value: "2 kg per m²" },
  { icon: <Sprout size={16} strokeWidth={1.5} />, label: "Voor", value: "Blad, volgend jaar" },
  { icon: <Clock size={16} strokeWidth={1.5} />, label: "Wanneer", value: "November of vroeg voorjaar" },
];

/** The task's panel, as the app opens it over the canvas's corner. */
function TaskPanel({ s, compact }: { s: S; compact?: boolean }) {
  return (
    <Popover show={s.panel} origin="top right" className="hr-panel" data-compact={compact || undefined}>
      <div className="hr-panel__head">
        <Check on={s.done} size={16} data-target="panel-check" data-cursor="pointer" />
        <span className="hr-panel__title">
          <span>Blok 6 bemesten</span>
          <span className="hr-panel__sub">Deze week</span>
        </span>
        <span className="hr-panel__close" aria-hidden>
          <X size={16} strokeWidth={1.5} />
        </span>
      </div>
      <dl className="hr-facts">
        {(compact ? FACTS.slice(0, 3) : FACTS).map((fact) => (
          <div key={fact.label} className="hr-fact">
            <dt>
              {fact.icon}
              {fact.label}
            </dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="hr-panel__foot">
        <Button variant="primary" size="large" icon={<CheckGlyph />} className="hr-done" data-target="done" data-cursor="pointer">
          Gedaan
        </Button>
        <Button variant="ghost" size="large" icon={<Clock size={16} strokeWidth={1.5} />} className="hr-later">
          Later
        </Button>
      </div>
    </Popover>
  );
}

/** The app's toast after a change, top centre, with its undo. */
function DoneToast({ s }: { s: S }) {
  return (
    <div className="hr-toastslot">
      <Toast show={s.toast} className="hr-toast" action={<span className="hr-toast__undo" data-target="toast-undo" data-cursor="pointer">Ongedaan maken</span>}>
        Blok 6 bemesten afgevinkt
      </Toast>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* A bed's label, as the app draws it over the 3D view: its family's dot, the bed and the family. */
const FAMILY = { Blad: "#8fb56d", Peul: "#6aa891", Aardappel: "#ad9070" } as const;

function BedLabel({ bed, family, x, y }: { bed: string; family: keyof typeof FAMILY; x: number; y: number }) {
  return (
    <span className="hr-chip" style={{ left: x, top: y, "--dot": FAMILY[family] } as CSSProperties}>
      <span className="hr-chip__dot" aria-hidden />
      {bed}
      <span className="hr-chip__rule" aria-hidden />
      {family}
    </span>
  );
}

/** Blok 6 at 195%, the render without its labels (only Blok 6's is drawn, so nothing is sliced by
    an edge), 800 x 640 with the bed at 168, 334. */
function BedShot({ className }: { className: string }) {
  return (
    <div className={className}>
      <Image src={`${SRC}/garden-bed.webp`} alt="" width={800} height={640} unoptimized />
      <BedLabel bed="Blok 6" family="Blad" x={168} y={334} />
    </div>
  );
}

/**
 * The camera's move from the whole garden to the bed, as one flight: both renders travel on the
 * same path (the wide one pushes in on Blok 6 to where the close one has it, the close one comes
 * from where the wide one has it), and the close one fades in over the wide one mid-flight, so the
 * canvas is never washed out between them.
 */
function Garden({ zoomed }: { zoomed: boolean }) {
  return (
    <div className="hr-garden" data-zoomed={zoomed || undefined}>
      <Image className="hr-shot hr-shot--wide" src={`${SRC}/garden.webp`} alt="" width={764} height={532} unoptimized priority />
      <BedShot className="hr-shot hr-shot--bed" />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The hero: a task opens its bed, and is done.
 * --------------------------------------------------------------------------------------------- */

const rest = (layout: string) => (layout === "compact" ? { x: 290, y: 96 } : { x: 960, y: 250 });

async function heroScript(a: Act<S>) {
  await a.wait(900);
  if (a.layout === "compact") {
    a.mark("done");
    await a.click({ at: "done", x: 0.9, y: 0.5 });
    a.put({ done: true });
    await a.wait(320);
    a.put({ toast: true });
    await a.move(rest("compact"), { duration: 700 });
    await a.wait(1500);
    // The toast's own undo takes it back, as on the app's phones.
    a.mark("undo");
    await a.click("toast-undo");
    a.put({ toast: false, done: false });
    await a.move(rest("compact"), { duration: 700 });
    await a.wait(900);
    return;
  }
  a.mark("task");
  await a.click("task");
  a.put({ selected: true, zoomed: true });
  await a.wait(420);
  a.put({ panel: true });
  await a.wait(900);
  a.mark("done");
  await a.click({ at: "done", x: 0.9, y: 0.5 });
  a.put({ done: true });
  await a.wait(420);
  a.put({ gone: true, toast: true });
  await a.move(rest("wide"), { duration: 800 });
  await a.wait(1600);
  // The toast's undo brings the task back; the fit button takes the camera back out.
  a.mark("undo");
  await a.click("toast-undo");
  a.put({ toast: false, gone: false, done: false });
  await a.wait(600);
  await a.click("fit");
  a.put({ panel: false, selected: false });
  await a.wait(160);
  a.put({ zoomed: false });
  await a.move(rest("wide"), { duration: 800 });
  await a.wait(600);
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 420 }}
      initial={START}
      poster={OPEN}
      script={still ? undefined : heroScript}
      cursor={still ? undefined : { at: { wide: rest("wide"), compact: rest("compact") } }}
      fill
      className="scene hr"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <div className="hr-compact">
            <BedShot className="hr-compact__bed" />
            <DoneToast s={s} />
            <TaskPanel s={{ ...s, panel: true }} compact />
          </div>
        ) : (
          <Window url="app.gethori.com" className="hr-window">
            <div className="hr-app">
              <Sidebar s={s} />
              <div className="hr-main">
                <TopBar />
                <div className="hr-canvas">
                  <Garden zoomed={s.zoomed} />
                  <Tools zoom={s.zoomed ? "195%" : "100%"} />
                  <TaskPanel s={s} />
                  <DoneToast s={s} />
                </div>
              </div>
            </div>
          </Window>
        )
      }
    </Stage>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The card: the season plays and the garden grows.
 * --------------------------------------------------------------------------------------------- */

type C = { frame: number; playing: boolean };
const SUMMER: C = { frame: SEASON.length - 1, playing: false };

async function coverScript(a: Act<C>) {
  await a.wait(250);
  // Play starts the season over, as it does in the app, and runs it to August.
  a.put({ playing: true, frame: 0 });
  await a.wait(700);
  for (let i = 1; i < SEASON.length; i++) {
    a.put({ frame: i });
    await a.wait(600);
  }
  a.put({ playing: false });
  await a.wait(1600);
}

function Cover({ still }: SceneProps) {
  return (
    <Stage<C> width={440} height={550} initial={SUMMER} poster={SUMMER} script={still ? undefined : coverScript} play="hover" className="scene hr">
      {(s) => {
        const at = SEASON[s.frame];
        return (
          <div className="hr-cover">
            <div className="hr-cover__bar">
              <Scrubber week={at.week} label={at.label} playing={s.playing} />
            </div>
            <div className="hr-cover__garden">
              {SEASON.map((step, i) => (
                <Image
                  key={step.week}
                  className="hr-frame"
                  data-on={i <= s.frame || undefined}
                  src={`${SRC}/season-${String(step.week).padStart(2, "0")}.webp`}
                  alt=""
                  width={600}
                  height={484}
                  unoptimized
                />
              ))}
            </div>
          </div>
        );
      }}
    </Stage>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The rotation: a bed's panel, over the bed it describes.
 * --------------------------------------------------------------------------------------------- */

const ROTATION = [
  { year: "2026", crop: "Peul", state: "past" },
  { year: "Dit jaar", crop: "Blad", state: "now" },
  { year: "2028", crop: "Aardappel", state: "next" },
];

function Rotation() {
  return (
    <Stage width={640} height={520} compact={{ below: 480, width: 358, height: 420 }} fill className="scene hr">
      {() => (
        <div className="hr-rot">
          <BedShot className="hr-rot__garden" />
          <div className="hr-panel hr-bed">
            <div className="hr-panel__head">
              <span className="hr-bed__no">6</span>
              <span className="hr-panel__title">
                <span>Blok 6</span>
                <span className="hr-panel__sub">Blad</span>
              </span>
              <span className="hr-panel__close" aria-hidden>
                <X size={16} strokeWidth={1.5} />
              </span>
            </div>
            <div className="hr-block">
              <span className="hr-block__label">Wisselteelt</span>
              <div className="hr-rotation">
                {ROTATION.map((step) => (
                  <span key={step.year} className="hr-rotation__step" data-state={step.state}>
                    <span className="hr-rotation__dot" />
                    <span className="hr-rotation__crop">{step.crop}</span>
                    <span className="hr-rotation__year">{step.year}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hr-block">
              <span className="hr-block__label">Bemesten</span>
              <span className="hr-block__text">2 kg compost per m² voor blad</span>
              <span className="hr-block__hint">Begin november, of vroeg in het voorjaar.</span>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------------------------------------
 * The calendar: the cabbages through the year, from the app's own plan.
 * --------------------------------------------------------------------------------------------- */

/* Quarter months (0 to 48) from the app: pre-sowing, on the bed, harvest. */
type Crop = { name: string; detail?: string; thumb: string; pre?: [number, number]; bed: [number, number]; harvest: [number, number] };

const CROPS: Crop[] = [
  { name: "Broccoli", detail: "zomer", thumb: "broccoli", pre: [8, 12], bed: [12, 24], harvest: [24, 36] },
  { name: "Palmkool", thumb: "palmkool", pre: [8, 13], bed: [13, 32], harvest: [32, 48] },
  { name: "Spruiten", thumb: "spruiten", pre: [8, 13], bed: [13, 37], harvest: [37, 48] },
  { name: "Witte kool", thumb: "witte-kool", pre: [8, 16], bed: [16, 32], harvest: [32, 41] },
  { name: "Savooiekool", detail: "winter", thumb: "savooiekool", pre: [13, 17], bed: [17, 36], harvest: [36, 48] },
  { name: "Boerenkool", thumb: "boerenkool", pre: [16, 20], bed: [20, 36], harvest: [36, 48] },
  { name: "Red russian kale", detail: "herfst", thumb: "red-russian-kale", pre: [16, 20], bed: [20, 29], harvest: [29, 48] },
  { name: "Tatsoi", thumb: "tatsoi", pre: [16, 20], bed: [20, 21], harvest: [21, 40] },
];

const MONTHS = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
const NOW = 40.5;
/* Quarter months to px, counted from the first month shown (--hr-from: March on phones). */
const q = (n: number) => `calc((${n} - var(--hr-from)) * var(--hr-q))`;
/* A length in quarter months: a bar's width, which no offset touches. */
const len = (n: number) => `calc(${n} * var(--hr-q))`;

function CalendarRow({ crop }: { crop: Crop }) {
  const start = crop.pre?.[0] ?? crop.bed[0];
  const end = crop.harvest[1];
  return (
    <div className="hr-cal__row">
      {crop.pre ? <span className="hr-phase hr-phase--pre" style={{ left: q(crop.pre[0]), width: len(crop.pre[1] - crop.pre[0]) }} /> : null}
      <span className="hr-phase hr-phase--bed" style={{ left: q(crop.bed[0]), width: len(crop.bed[1] - crop.bed[0]) }} />
      <span className="hr-phase hr-phase--harvest" style={{ left: q(crop.harvest[0]), width: len(crop.harvest[1] - crop.harvest[0]) }} />
      <span className="hr-phase hr-phase--edge" style={{ left: q(start), width: len(end - start) }} />
      <span className="hr-cal__label" style={{ left: q(start) }}>
        <Image src={`${SRC}/cal-${crop.thumb}.webp`} alt="" width={16} height={16} unoptimized />
        {crop.name}
        {crop.detail ? <span className="hr-cal__detail">{crop.detail}</span> : null}
      </span>
    </div>
  );
}

function SowingCalendar() {
  return (
    <Stage width={640} height={520} compact={{ below: 480, width: 358, height: 440 }} fill className="scene hr">
      {(_s, _rect, layout) => {
        /* On a phone, March to December, each month by its letter as the app's narrow calendar
           has it: every bar whole at a size that reads. */
        const compact = layout === "compact";
        const months = compact ? MONTHS.slice(2) : MONTHS;
        const first = MONTHS.length - months.length;
        return (
        <div className="hr-cal">
          <div className="hr-cal__legend" aria-hidden>
            <span>
              <span className="hr-swatch hr-swatch--pre" />
              Voorkweek
            </span>
            <span>
              <span className="hr-swatch hr-swatch--bed" />
              Op het bed
            </span>
            <span>
              <span className="hr-swatch hr-swatch--harvest" />
              Oogst
            </span>
          </div>
          <div className="hr-cal__grid">
            <div className="hr-cal__months">
              {/* November's name is where today's pill sits, so the pill stands for it. */}
              {months.map((month, i) =>
                month === "Nov" ? null : (
                  <span key={month} style={{ left: q((first + i) * 4) }}>
                    {compact ? month.charAt(0) : month}
                  </span>
                ),
              )}
              <span className="hr-cal__today" style={{ left: q(NOW) }}>
                1 nov
              </span>
            </div>
            <div className="hr-cal__body">
              {months.map((month, i) => (
                <span key={month} className="hr-cal__rule" style={{ left: q((first + i) * 4) }} />
              ))}
              <span className="hr-cal__now" style={{ left: q(NOW) }} />
              <div className="hr-cal__group">
                <span className="hr-cal__dot" />
                Kool
                <span className="hr-count">25</span>
              </div>
              {/* As many rows as end inside the fade: none sliced by the stage's edge. */}
              {(compact ? CROPS.slice(0, 7) : CROPS).map((crop) => (
                <CalendarRow key={`${crop.name}-${crop.detail ?? ""}`} crop={crop} />
              ))}
            </div>
          </div>
        </div>
        );
      }}
    </Stage>
  );
}

export const horiScenes = {
  "hori-cover": Cover,
  "hori-hero": Hero,
  "hori-rotation": Rotation,
  "hori-calendar": SowingCalendar,
};
