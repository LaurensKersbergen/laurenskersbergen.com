"use client";

import { Bar, Button, Check, Count, Facepile, Icon, Meter, Stage, States, Window, type Act } from "@/components/stageshow/kit";
import type { SceneProps } from "./index";
import "./growth-tribe.css";

/*
 * Growth Tribe: a course on the learning platform. The story is how it feels to use: finish a
 * lesson, mark it complete, and the button confirms on itself while the lesson ticks off in the
 * list and the course's progress moves on a beat later. A second press takes it back, so the loop
 * returns with a cause on screen. Real strings: the course, its lessons, the button and the count.
 */

const LESSONS = ["Why experiment", "Writing a hypothesis", "Designing experiments", "Reading the results", "Scaling what works"];
const CURRENT = 2;

type S = { done: boolean; progress: number };
const START: S = { done: false, progress: 2 };
const DONE: S = { done: true, progress: 3 };

function Lessons({ s, compact }: { s: S; compact?: boolean }) {
  return (
    <div className="gt-lessons">
      <div className="gt-course">
        <span className="gt-course__eyebrow">Course</span>
        <span className="gt-course__title">Growth Marketing</span>
        <span className="gt-course__meter">
          <Meter value={s.progress / LESSONS.length} />
          <span className="gt-course__count">
            <Count value={s.progress} /> of {LESSONS.length}
          </span>
        </span>
      </div>
      <div className="gt-list">
        {LESSONS.slice(0, compact ? 4 : LESSONS.length).map((lesson, i) => (
          <span key={lesson} className="gt-lesson" data-current={i === CURRENT || undefined}>
            <Check on={i < CURRENT || (i === CURRENT && s.done)} size={18} />
            <span>{lesson}</span>
          </span>
        ))}
      </div>
      {compact ? null : (
        <div className="gt-module">
          <Bar w={64} h={7} r={3} tone={3} />
          {[132, 104, 118].map((w) => (
            <span key={w} className="gt-lesson">
              <Check on={false} size={18} />
              <Bar w={w} h={7} r={3} tone={2} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Lesson({ s }: { s: S }) {
  return (
    <div className="gt-main">
      <span className="gt-eyebrow">Lesson {CURRENT + 1}</span>
      <span className="gt-title">{LESSONS[CURRENT]}</span>
      <div className="gt-video">
        <span className="gt-play">
          <Icon name="play" size={22} filled />
        </span>
        <span className="gt-scrub">
          <span style={{ width: "100%" }} />
        </span>
      </div>
      <div className="gt-actions">
        <Button variant="primary" size="large" data-target="complete">
          <States value={s.done ? "done" : "todo"} states={{ todo: "Mark as complete", done: "Completed" }} />
        </Button>
        <span className="gt-next">
          <Bar w={92} h={8} r={4} tone={3} />
        </span>
      </div>
      <div className="gt-upnext">
        <span className="gt-upnext__thumb" />
        <span className="gt-upnext__text">
          <span className="gt-upnext__label">Up next</span>
          <span className="gt-upnext__title">{LESSONS[CURRENT + 1]}</span>
        </span>
        <Bar w={44} h={7} r={3} tone={2} />
      </div>
    </div>
  );
}

async function script(a: Act<S>) {
  await a.wait(900);
  a.mark("complete");
  await a.click("complete");
  a.put({ done: true });
  await a.wait(420);
  a.put({ progress: 3 });
  await a.move(a.layout === "compact" ? { x: 300, y: 380 } : { x: 960, y: 600 }, { duration: 800 });
  await a.wait(2200);
  // Taken back from the same button, so the return has a cause.
  a.mark("undo");
  await a.click("complete");
  a.put({ done: false });
  await a.wait(420);
  a.put({ progress: 2 });
  await a.move(a.layout === "compact" ? { x: 300, y: 380 } : { x: 960, y: 600 }, { duration: 800 });
  await a.wait(600);
}

function Hero({ still }: SceneProps) {
  return (
    <Stage<S>
      width={1120}
      height={680}
      compact={{ below: 640, width: 358, height: 420 }}
      initial={START}
      poster={DONE}
      script={still ? undefined : script}
      cursor={still ? undefined : { at: { wide: { x: 960, y: 600 }, compact: { x: 300, y: 380 } } }}
      fill
      className="scene gt"
    >
      {(s, _rect, layout) =>
        layout === "compact" ? (
          <div className="gt-compact">
            <Lesson s={s} />
          </div>
        ) : (
          <Window url="app.growthtribe.io/courses/growth-marketing" className="gt-window">
            <div className="gt-app">
              <Lessons s={s} />
              <Lesson s={s} />
            </div>
          </Window>
        )
      }
    </Stage>
  );
}

async function coverScript(a: Act<S>) {
  await a.wait(300);
  a.put({ done: true });
  await a.wait(380);
  a.put({ progress: 3 });
  await a.wait(1800);
}

/** The card: the course's lesson list hung from the top-right, a lesson ticking off while hovered. */
function Cover({ still }: SceneProps) {
  return (
    <Stage<S> width={440} height={550} initial={START} poster={START} script={still ? undefined : coverScript} play="hover" className="scene gt">
      {(s) => (
        <div className="gt-cover">
          <Lessons s={s} compact />
        </div>
      )}
    </Stage>
  );
}

/** Progress, the one number that gets to be big, with the cohort taking the course together. */
function Progress() {
  return (
    <Stage width={640} height={520} fill className="scene gt">
      {() => (
        <div className="gt-progress">
          <span className="gt-progress__label">Growth Marketing</span>
          <span className="gt-progress__value">
            <Count value={60} />
            <span className="gt-progress__unit">%</span>
          </span>
          <Meter value={0.6} />
          <span className="gt-progress__line">3 of 5 lessons complete</span>
          <div className="gt-progress__cohort">
            <Facepile names={["Maya", "Jonas", "Ana", "Sam"]} size={30} />
            <span>Your cohort</span>
          </div>
          <div className="gt-progress__next">
            <span className="gt-upnext__label">Next lesson</span>
            <span className="gt-upnext__title">{LESSONS[CURRENT + 1]}</span>
          </div>
        </div>
      )}
    </Stage>
  );
}

const CHAPTERS = [
  { title: "What a good test needs", time: "2:10", done: true },
  { title: "Choosing one metric", time: "4:35", done: true },
  { title: "Sizing the sample", time: "3:20", done: false },
];

/** The lesson player close up: the video and its chapters, off the bottom. */
function Player() {
  return (
    <Stage width={640} height={520} fill className="scene gt">
      {() => (
        <div className="gt-player">
          <div className="gt-video gt-video--close">
            <span className="gt-play">
              <Icon name="play" size={26} filled />
            </span>
            <span className="gt-scrub">
              <span style={{ width: "58%" }} />
            </span>
          </div>
          <div className="gt-chapters">
            {CHAPTERS.map((chapter) => (
              <span key={chapter.title} className="gt-chapter" data-done={chapter.done || undefined}>
                <Check on={chapter.done} size={18} />
                <span className="gt-chapter__title">{chapter.title}</span>
                <span className="gt-chapter__time">{chapter.time}</span>
              </span>
            ))}
            <span className="gt-chapter">
              <Check on={false} size={18} />
              <Bar w={132} h={7} r={3} tone={3} />
            </span>
          </div>
        </div>
      )}
    </Stage>
  );
}

export const growthTribeScenes = {
  "growth-tribe-cover": Cover,
  "growth-tribe-hero": Hero,
  "growth-tribe-progress": Progress,
  "growth-tribe-lesson": Player,
};
