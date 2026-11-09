"use client";

import type { ComponentType } from "react";
import { StageLabelContext } from "@/components/stageshow/kit";
import "./scenes.css";
import { growthTribeScenes } from "./growth-tribe";
import { horiScenes } from "./hori";
import { kpnScenes } from "./kpn";
import { mealPlannerScenes } from "./meal-planner";
import { miroScenes } from "./miro";
import { thisSiteScenes } from "./this-site";

/** What a scene can be asked for: `still` draws its poster and never plays (thumbnails). */
export type SceneProps = { still?: boolean };

const scenes: Record<string, ComponentType<SceneProps>> = {
  ...miroScenes,
  ...mealPlannerScenes,
  ...thisSiteScenes,
  ...growthTribeScenes,
  ...kpnScenes,
  ...horiScenes,
};

/**
 * What each scene on a project page shows, in words, for screen readers. The scenes are pictures of
 * interfaces, inert and hidden from assistive tech, so this is all a screen reader hears of them.
 * Covers are left out: on a card, the card's own title and line say what it is.
 */
const labels: Record<string, string> = {
  "miro-hero": "A table on a Miro board. Someone asks for themes from the Theme column's menu, and AI fills in a theme for each row.",
  "miro-cell": "Close-up of the Theme column's menu, with Suggest themes highlighted.",
  "miro-views": "The same rows as a board, grouped by the themes the AI suggested: Activation, Revenue and Retention.",
  "meal-planner-hero": "A week of dinners on a phone. Swapping Wednesday's dinner rolls in a new one, and the shopping list beside it updates.",
  "meal-planner-swap": "Close-up of the tastes the meal planner plans from.",
  "meal-planner-list": "The week's shopping list the meal planner hands you.",
  "hori-hero": "Hori, a vegetable garden planned in 3D. A task opens its bed, Blok 6, is marked done, and is undone again.",
  "hori-rotation": "Blok 6's panel in Hori: its crop rotation over the years, then its notes and photos.",
  "hori-calendar": "Hori's sowing calendar: when each crop is sown, planted out and harvested through the year.",
  "kpn-hero": "Choosing an internet speed on kpn.com. Picking a faster speed updates the order summary beside it.",
  "kpn-speed": "Close-up of the chosen internet speed on kpn.com.",
  "kpn-test": "An A/B test behind a change like this: two variants, one pulling ahead.",
  "growth-tribe-hero": "A Growth Tribe course. Marking a lesson complete ticks it off in the list and moves the course's progress on.",
  "growth-tribe-progress": "A Growth Tribe course's progress, with the cohort taking it together.",
  "growth-tribe-lesson": "Close-up of a Growth Tribe lesson: the video and its chapters.",
  "this-site-hero": "This site's homepage in a browser, with the floating menu in the corner opening and closing.",
  "this-site-tags": "The tags this site uses, each in its own colour, and the twelve colours they come from.",
  "this-site-island": "Close-up of this site's menu, open.",
};

/**
 * A project's Stageshow scene by name: `<scene>-cover` for its card, `<scene>-hero` and the rest
 * for its page (content/projects/*.mdx). An unknown name draws nothing. `describe` gives it its
 * description above for screen readers; without it the scene is decorative.
 */
export function ProjectScene({ name, still, describe }: { name: string; describe?: boolean } & SceneProps) {
  const Scene = scenes[name];
  if (!Scene) return null;
  return (
    <StageLabelContext.Provider value={describe ? labels[name] : undefined}>
      <Scene still={still} />
    </StageLabelContext.Provider>
  );
}
