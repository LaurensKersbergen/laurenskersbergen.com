import { cn, Tag } from "@kit/ui";

const sizes = {
  /* The project page's meta row: 20px pills, in the kit's tag shape. */
  lg: "h-9 rounded-[0.625rem] px-3 text-[1.0625rem] font-medium max-md:h-8 max-md:px-2.5 max-md:text-[0.9375rem]",
  /* A card's row, on white so the tint never melts into the card's ground. */
  sm: "h-6.5 rounded-[0.4375rem] px-2 text-[0.8125rem] font-medium shadow-[0_0_0_1px_rgb(0_0_0/0.04)]",
} as const;

/**
 * A project's tags in the kit's Tag, each in the vivid hue its name gives it (tagColor), so
 * "Product management" is the same colour on every card and page; the period follows in grey.
 */
export function ProjectTags({ tags, period, size, className }: { tags: string[]; period?: string; size: keyof typeof sizes; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", size === "lg" && "gap-2", className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="flex">
          <Tag className={cn(sizes[size], size === "sm" && "bg-white/85")}>{tag}</Tag>
        </li>
      ))}
      {period ? (
        <li className="flex">
          <Tag color="gray" className={cn(sizes[size], "tabular-nums", size === "sm" && "bg-white/85")}>
            {period}
          </Tag>
        </li>
      ) : null}
    </ul>
  );
}
