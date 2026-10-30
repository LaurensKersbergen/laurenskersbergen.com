import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { CloseIcon } from "./icons";

/** No "use client": these have no state, so server components render them directly. */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-card border border-line bg-surface p-5", className)} {...props} />;
}

/** The category colours in tokens.css, for kinds rather than states: groups, tags, series. */
export const categoryColors = ["gray", "brown", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "red"] as const;
export type CategoryColor = (typeof categoryColors)[number];

/* Full class names, so Tailwind generates them. */
const categoryText: Record<CategoryColor, string> = {
  gray: "bg-cat-gray-tint text-cat-gray",
  brown: "bg-cat-brown-tint text-cat-brown",
  orange: "bg-cat-orange-tint text-cat-orange",
  yellow: "bg-cat-yellow-tint text-cat-yellow",
  green: "bg-cat-green-tint text-cat-green",
  teal: "bg-cat-teal-tint text-cat-teal",
  blue: "bg-cat-blue-tint text-cat-blue",
  purple: "bg-cat-purple-tint text-cat-purple",
  pink: "bg-cat-pink-tint text-cat-pink",
  red: "bg-cat-red-tint text-cat-red",
};
/** A category's solid colour, for dots and swatches. */
export const categoryFill: Record<CategoryColor, string> = {
  gray: "bg-cat-gray",
  brown: "bg-cat-brown",
  orange: "bg-cat-orange",
  yellow: "bg-cat-yellow",
  green: "bg-cat-green",
  teal: "bg-cat-teal",
  blue: "bg-cat-blue",
  purple: "bg-cat-purple",
  pink: "bg-cat-pink",
  red: "bg-cat-red",
};
/** A category's soft tint, for tiles and bars behind content. */
export const categoryTint: Record<CategoryColor, string> = {
  gray: "bg-cat-gray-tint",
  brown: "bg-cat-brown-tint",
  orange: "bg-cat-orange-tint",
  yellow: "bg-cat-yellow-tint",
  green: "bg-cat-green-tint",
  teal: "bg-cat-teal-tint",
  blue: "bg-cat-blue-tint",
  purple: "bg-cat-purple-tint",
  pink: "bg-cat-pink-tint",
  red: "bg-cat-red-tint",
};

const tones = {
  neutral: "bg-fill text-ink-2",
  info: "bg-info-tint text-info",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
  danger: "bg-danger-tint text-danger",
} as const;

/** A short label. `tone` for a state (Overdue), `color` for a kind (a crop group, a tag). */
export function Badge({ tone = "neutral", color, className, ...props }: ComponentProps<"span"> & { tone?: keyof typeof tones; color?: CategoryColor }) {
  return (
    <span
      className={cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap", color ? categoryText[color] : tones[tone], className)}
      {...props}
    />
  );
}

/* A category's solid colour as text, so an SVG can draw in currentColor. */
const categoryInk: Record<CategoryColor, string> = {
  gray: "text-cat-gray",
  brown: "text-cat-brown",
  orange: "text-cat-orange",
  yellow: "text-cat-yellow",
  green: "text-cat-green",
  teal: "text-cat-teal",
  blue: "text-cat-blue",
  purple: "text-cat-purple",
  pink: "text-cat-pink",
  red: "text-cat-red",
};

/** The slice of the inner disc that shows `value` (0–1), from twelve o'clock, clockwise. */
function ringSlice(value: number) {
  const angle = Math.min(0.999, Math.max(0, value)) * 2 * Math.PI;
  const x = 7 + 3.5 * Math.sin(angle);
  const y = 7 - 3.5 * Math.cos(angle);
  return `M7 7 L7 3.5 A3.5 3.5 0 ${angle > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
}

/**
 * How far something has come, as Linear shows an issue's state: a dashed ring before it starts, a
 * ring that fills as it moves on (`value` 0–1), a filled circle with a check when it's done (1).
 * Pass `label` when the ring stands alone; next to its phase name ("Oogsten") leave it out.
 */
export function ProgressRing({ value, color = "gray", label, className }: { value: number | null; color?: CategoryColor; label?: string; className?: string }) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg viewBox="0 0 14 14" className={cn("size-3.5 shrink-0", value === null ? "text-ink-3" : categoryInk[color], className)} {...a11y}>
      {value === null ? (
        <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.2 1.6" />
      ) : value >= 1 ? (
        <>
          <circle cx="7" cy="7" r="6.25" fill="currentColor" />
          <path d="M4.4 7.2l1.8 1.8 3.4-3.6" fill="none" className="stroke-bg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {value > 0 ? <path d={ringSlice(value)} fill="currentColor" /> : null}
        </>
      )}
    </svg>
  );
}

/* Tags take their colour from their name. Red stays out: on a tag it reads as an error. */
const tagColors = categoryColors.filter((color) => color !== "red");

/** The colour a tag gets from its name: always the same for the same name, whatever its case or spacing. */
export function tagColor(name: string): CategoryColor {
  let hash = 0;
  for (const char of name.trim().toLowerCase()) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return tagColors[hash % tagColors.length] ?? "gray";
}

/**
 * A value people named themselves, like a variety ("Helda"): a soft rectangle in a colour that comes
 * from the name, as Notion's tags, so the same name looks the same everywhere. Badges are for what
 * the app says (a state, a group); tags are for people's own words.
 */
export function Tag({ children, color, className }: { children: string; color?: CategoryColor; className?: string }) {
  return (
    <span className={cn("inline-flex h-5 max-w-full items-center rounded-small px-1.5 text-control-sm whitespace-nowrap", categoryText[color ?? tagColor(children)], className)}>
      <span className="truncate">{children}</span>
    </span>
  );
}

/**
 * Tags in a row that wraps onto the next line when they don't fit. Its first line sits where a 32px
 * row's text does, so in a DescriptionList the label stays level with the first tags.
 */
export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cn("flex min-w-0 flex-wrap gap-1 py-1.5", className)}>
      {tags.map((tag) => (
        <li key={tag} className="flex max-w-full min-w-0">
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}

/** A placeholder while something loads; give it the size of what's coming. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div aria-hidden className={cn("animate-pulse rounded-small bg-fill", className)} {...props} />;
}

/** A dot for "new" or "unread". Inside a `relative` parent (an icon button) it sits on the corner. */
/**
 * A dot. Without `color` it's the accent "new"/"unread" dot (with a ring to sit on an icon's corner);
 * with a category `color` it marks a kind, like a crop group before its name.
 */
export function DotBadge({ label, color, className }: { label?: string; color?: CategoryColor; className?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block size-2 shrink-0 rounded-full", color ? categoryFill[color] : "bg-accent ring-2 ring-bg", className)}
    />
  );
}

/**
 * A coloured dot before a short label: a status ("Geoogst"), a group, a year in a rotation. Text
 * glyphs start a hair inside their box and a solid dot doesn't, so the dot sits one pixel in: it
 * then lines up with the heading and title above it instead of poking out to their left.
 */
export function DotLabel({ color, children, className }: { color: CategoryColor; children: ReactNode; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <DotBadge color={color} className="ml-px size-1.5" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

const thumbnailSizes = { sm: "size-7", md: "size-9", lg: "size-11" } as const;

/**
 * A square picture of a thing: a product shot, a plant, a file preview. The image fits inside on a
 * soft tile; without `src` it shows `icon`, or a placeholder while the picture is still coming.
 * Decorative by default (the row next to it names the thing); pass `alt` when it carries meaning.
 */
export function Thumbnail({
  src,
  alt = "",
  icon,
  size = "md",
  className,
}: {
  src?: string;
  alt?: string;
  icon?: ReactNode;
  size?: keyof typeof thumbnailSizes;
  className?: string;
}) {
  return (
    <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-small bg-fill text-ink-2", thumbnailSizes[size], className)}>
      {src ? <img src={src} alt={alt} className="size-full object-contain p-0.5" /> : icon ? icon : <span aria-hidden className="size-1/2 animate-pulse rounded-full bg-line" />}
    </span>
  );
}

/**
 * What a list or panel shows when it has nothing: "Niets te doen deze week", "No results". A calm
 * icon, one line that says what's going on, an optional line on what to do and an action.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-1 px-4 py-8 text-center", className)}>
      {icon ? <span className="mb-2 grid size-10 place-items-center rounded-full bg-fill text-ink-2">{icon}</span> : null}
      <p className="text-control font-medium text-ink">{title}</p>
      {description ? <p className="max-w-72 text-control-sm text-ink-2">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

const countTones = {
  neutral: "bg-fill text-ink-2",
  strong: "bg-strong text-on-strong",
  accent: "bg-accent text-on-accent",
} as const;

/** A number: open tasks on a tab, items in a group. Above `max` it shows "99+". */
export function CountBadge({ count, max = 99, tone = "neutral", className }: { count: number; max?: number; tone?: keyof typeof countTones; className?: string }) {
  return (
    <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums", countTones[tone], className)}>
      {count > max ? `${max}+` : count}
    </span>
  );
}

/**
 * A filter or tag. With onRemove it gets an ×; with onClick it toggles (selected shows it's on).
 */
export function Chip({
  children,
  onRemove,
  removeLabel = "Remove",
  onClick,
  selected,
  className,
}: {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const look = cn(
    "inline-flex h-7 items-center gap-1 rounded-full text-control-sm font-medium transition-colors",
    selected ? "bg-strong text-on-strong" : "bg-fill text-ink",
    onRemove ? "pr-0.5" : undefined,
    onClick ? undefined : onRemove ? "pl-2.5" : "px-2.5",
    className,
  );
  const remove = onRemove ? (
    <button
      type="button"
      aria-label={removeLabel}
      onClick={onRemove}
      className="-mr-0.5 grid size-6 cursor-pointer place-items-center rounded-full opacity-60 transition-opacity hover:bg-current/15 hover:opacity-100"
    >
      <CloseIcon size={12} />
    </button>
  ) : null;
  if (onClick) {
    return (
      <span className={look}>
        <button
          type="button"
          aria-pressed={selected}
          onClick={onClick}
          className={cn("flex h-full cursor-pointer items-center rounded-full", onRemove ? "pl-2.5" : "px-2.5")}
        >
          {children}
        </button>
        {remove}
      </span>
    );
  }
  return (
    <span className={look}>
      {children}
      {remove}
    </span>
  );
}

/**
 * Properties as label and value, as in Notion's and Linear's side panels: Blok, Kas; Zaaien, 15
 * februari. Every row is 32px; a value that wraps (tags) keeps its label level with its first line. A value people can change is an inline field (Select or DatePicker
 * with variant="inline"), in full ink with a chevron; a value they can't is plain text, muted
 * and without hover, so the difference is clear at a glance. Plain strings count as read-only; pass
 * `readOnly` for other read-only content (a MetaList). A real <dl>, so screen readers read each
 * value with its label; labels line up in their own column, with an optional icon.
 */
export function DescriptionList({
  items,
  className,
}: {
  items: { term: ReactNode; details: ReactNode; icon?: ReactNode; readOnly?: boolean }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid grid-cols-[minmax(6.5rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-control", className)}>
      {items.map((item, i) => (
        <div key={i} className="contents">
          <dt className="flex h-8 items-center gap-2 self-start text-ink-2">
            {item.icon ? <span className="flex shrink-0 text-ink-3">{item.icon}</span> : null}
            {item.term}
          </dt>
          <dd className={cn("flex min-h-8 min-w-0 items-center", (item.readOnly ?? (typeof item.details === "string" || typeof item.details === "number")) ? "text-ink-2" : "text-ink")}>
            {item.details}
          </dd>
        </div>
      ))}
    </dl>
  );
}
