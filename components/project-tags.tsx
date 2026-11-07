import { cn, Tag } from "@kit/ui";

const sizes = {
  /* The project page's meta row: 20px pills, in the kit's tag shape. */
  lg: "h-9 rounded-[0.625rem] px-3 text-[1.0625rem] font-medium max-md:h-8 max-md:px-2.5 max-md:text-[0.9375rem]",
  /* A card's row, in the card's own hue (its --hue-ink) rather than each tag's: a faint tint of
     that ink with a hairline of it, so the tags read as part of the card on any ground. The `!`
     wins over the Tag's name-based colour. */
  sm: "h-6.5 rounded-[0.4375rem] px-2 text-[0.8125rem] font-medium text-(--hue-ink)! bg-[color-mix(in_oklch,var(--hue-ink)_7%,transparent)]! shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--hue-ink)_12%,transparent)]",
} as const;

/**
 * A project's tags in the kit's Tag. On the project page each takes the vivid hue its name gives it
 * (tagColor); on a card they all take the card's hue instead. Tags name categories, never years.
 */
export function ProjectTags({ tags, size, className }: { tags: string[]; size: keyof typeof sizes; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", size === "lg" && "gap-2", className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="flex">
          <Tag className={sizes[size]}>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
