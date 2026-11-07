/**
 * A project's ground: the colour behind its card, its media and its scenes. In light mode, the
 * kit's pale vivid tint. In dark mode the kit's dark tints turn muddy (yellow goes olive, orange
 * brown, and all of them close), so the ground is a near-black step of the hue's chart colour.
 * It mixes in oklab: an oklch mix would pull every hue toward the grey's 0°, which is red. And
 * color-mix() rather than relative colours, since a browser with light-dark() but no relative
 * colours would drop the whole value, light ground included.
 */
export const ground = (hue: string) =>
  `light-dark(var(--ui-vivid-${hue}-subtle), color-mix(in oklab, var(--ui-vivid-${hue}-chart) 18%, oklch(0.08 0 0)))`;
