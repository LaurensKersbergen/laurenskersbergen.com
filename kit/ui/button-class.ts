import { cn } from "./cn";

const variants = {
  primary: "bg-strong text-on-strong shadow-control-filled hover:bg-strong-hover",
  secondary: "bg-raised text-ink shadow-control hover:bg-raised-hover",
  accent: "bg-accent text-on-accent shadow-control-filled hover:opacity-90",
  danger: "bg-danger text-on-accent shadow-control-filled hover:opacity-90",
  ghost: "bg-transparent text-ink-2 hover:bg-hover hover:text-ink",
} as const;

const sizes = {
  sm: "h-control-sm px-3 text-control-sm",
  md: "h-control px-4 text-control",
  /** Square, for a button that holds only an icon: give it an aria-label (and a Tip). */
  icon: "size-control text-control",
  "icon-sm": "size-control-sm text-control-sm",
  /** 24px (32px on touch screens), for a clear or dismiss button inside a field, alert or row. */
  "icon-xs": "size-6 rounded-small text-control-sm pointer-coarse:size-8",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/**
 * Button classes, also for things that aren't a <button>, such as a link that looks like one.
 * No "use client" here, so server components can call it. Sizes and the pressed shrink match
 * shiori.sh: 40px / 14px, 32px / 13px, weight 500.
 */
export function buttonClass({ variant = "secondary", size = "md" }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer select-none touch-manipulation items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-medium",
    "transition-[background-color,opacity,scale] duration-fast ease-out motion-safe:active:scale-[0.96]",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:active:scale-100",
    variants[variant],
    sizes[size],
  );
}
