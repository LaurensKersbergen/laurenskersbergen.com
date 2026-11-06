import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The theme names from theme.css, so tailwind-merge knows `text-control` is a size and
 * `text-ink` a colour; without this it drops one of them as a conflict. A test keeps the
 * colour list in step with theme.css.
 */
/** Base UI's className can be a function of state; our wrappers only pass strings through. */
export const stringClass = (className: unknown) => (typeof className === "string" ? className : undefined);

export const themeColors = [
  "bg",
  "canvas",
  "surface",
  "popover",
  "fill",
  "hover",
  "selected",
  "scrim",
  "sidebar",
  "sidebar-hover",
  "line",
  "line-2",
  "ink",
  "ink-2",
  "ink-3",
  "raised",
  "raised-hover",
  "strong",
  "strong-hover",
  "on-strong",
  "tooltip",
  "on-tooltip",
  "accent",
  "on-accent",
  "danger",
  "danger-tint",
  "warn",
  "warn-tint",
  "success",
  "success-tint",
  "info",
  "info-tint",
  "cat-gray",
  "cat-gray-tint",
  "cat-brown",
  "cat-brown-tint",
  "cat-orange",
  "cat-orange-tint",
  "cat-yellow",
  "cat-yellow-tint",
  "cat-green",
  "cat-green-tint",
  "cat-teal",
  "cat-teal-tint",
  "cat-blue",
  "cat-blue-tint",
  "cat-purple",
  "cat-purple-tint",
  "cat-pink",
  "cat-pink-tint",
  "cat-red",
  "cat-red-tint",
];

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: themeColors,
      text: ["control", "control-sm", "prose"],
      radius: ["control", "card", "small", "inner", "tiny"],
      shadow: ["control", "control-filled", "overlay"],
      spacing: ["control", "control-sm"],
    },
    classGroups: {
      duration: [{ duration: ["fast", "base", "slow"] }],
    },
  },
});

/** Join class names; later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
