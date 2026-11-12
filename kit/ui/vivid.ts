/** The vivid colour set's hues, in the order /design shows them. The values live in tokens.css. */
export const vividHues = ["gray", "brown", "sage", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "purple", "pink"] as const;
export type VividHue = (typeof vividHues)[number];

/**
 * Each hue's tokens, as the suffix after `vivid-<hue>`: "" is its text and icon colour, so
 * `text-vivid-red`, `bg-vivid-red-subtle`, `border-vivid-red-line-mild`, `text-vivid-red-on-mild`,
 * `bg-vivid-red-chart`.
 */
export const vividTokens = [
  "-subtle",
  "-subtle-hover",
  "-subtle-pressed",
  "-mild",
  "-mild-hover",
  "-mild-pressed",
  "-line-subtle",
  "-line-mild",
  "-line-strong",
  "",
  "-on-mild",
  "-chart",
] as const;

export const vividColors = vividHues.flatMap((hue) => vividTokens.map((token) => `vivid-${hue}${token}`));
