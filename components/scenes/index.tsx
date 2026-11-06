"use client";

import type { ComponentType } from "react";
import "./scenes.css";
import { growthTribeScenes } from "./growth-tribe";
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
};

/**
 * A project's Stageshow scene by name: `<scene>-cover` for its card, `<scene>-hero` and the rest
 * for its page (content/projects/*.mdx). An unknown name draws nothing.
 */
export function ProjectScene({ name, still }: { name: string } & SceneProps) {
  const Scene = scenes[name];
  return Scene ? <Scene still={still} /> : null;
}
