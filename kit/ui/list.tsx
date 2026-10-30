import { type PointerEventHandler, type ReactNode, useId } from "react";
import { cn } from "./cn";
import { CountBadge } from "./display";
import { groupLabelClass } from "./group-label";
import { type LinkRender, LinkOrAnchor } from "./link";

/*
 * Rows of content like an inbox, a task list or search results: something in front (thumbnail,
 * icon, avatar), a title with a grey line under it, and actions at the end. Structure after
 * shadcn/ui's Item. Settings with a switch or checkbox are form fields, not list rows: use
 * <Switch description> inside a <Fieldset>.
 */

export function List({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <ul aria-label={label} className={cn("flex flex-col gap-px", className)}>
      {children}
    </ul>
  );
}

/**
 * A titled group of rows, with an optional count in a pill: "Te laat (3)". Its own list, labelled by
 * the title, so screen readers say "Te laat 3, list, 3 items". Stack several for an inbox with sections.
 */
export function ListGroup({ title, count, children, className }: { title: ReactNode; count?: number; children: ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={cn("flex flex-col", className)}>
      <p id={id} className={cn(groupLabelClass, "flex items-center gap-1.5 px-2")}>
        {title}
        {count !== undefined ? <CountBadge count={count} /> : null}
      </p>
      <ul aria-labelledby={id} className="flex flex-col gap-px">
        {children}
      </ul>
    </div>
  );
}

export type ListItemProps = {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  /** Actions at the end. They sit next to the row's button, never inside it. */
  trailing?: ReactNode;
  /** A control in front of the row's button, never inside it: a checkbox to tick the row off. */
  start?: ReactNode;
  /** The row that's open next to the list, as in a mail app. */
  selected?: boolean;
  /** A dot at the end for something new, as in an inbox; the title turns bold too. */
  unread?: boolean;
  /** What screen readers say for the dot, in the app's language. */
  unreadLabel?: string;
  onClick?: (event: React.MouseEvent) => void;
  /** For rows that can also be dragged somewhere (pressed, then moved). */
  onPointerDown?: PointerEventHandler<HTMLElement>;
  href?: string;
  /** The app's router link instead of href: <Link href="/tasks/1" />. */
  render?: LinkRender;
  className?: string;
};

export function ListItem({ title, description, leading, trailing, start, selected, unread, unreadLabel = "New", onClick, onPointerDown, href, render, className }: ListItemProps) {
  const body = (
    <>
      {leading ? <span className="flex shrink-0 items-center text-ink-2">{leading}</span> : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("truncate text-control text-ink", unread && "font-medium")}>{title}</span>
        {description ? <span className="truncate text-control-sm text-ink-2">{description}</span> : null}
      </span>
    </>
  );
  const main = "flex min-w-0 flex-1 items-center gap-3 py-2 pl-2 text-left outline-none focus-visible:outline-none";
  return (
    <li
      data-selected={selected || undefined}
      className={cn(
        "group flex items-center gap-1 rounded-control pr-1.5 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
        (onClick || href || render) && "hover:bg-hover",
        "data-selected:bg-selected",
        className,
      )}
    >
      {start ? <span className="flex shrink-0 items-center pl-1">{start}</span> : null}
      {href || render ? (
        <LinkOrAnchor href={href} render={render} aria-current={selected ? "page" : undefined} className={main} onPointerDown={onPointerDown}>
          {body}
        </LinkOrAnchor>
      ) : onClick ? (
        <button type="button" aria-current={selected || undefined} onClick={onClick} onPointerDown={onPointerDown} className={cn(main, "cursor-pointer")}>
          {body}
        </button>
      ) : (
        <div className={main}>{body}</div>
      )}
      {unread || trailing ? (
        <span className="flex shrink-0 items-center gap-0.5">
          {unread ? <span role="img" aria-label={unreadLabel} className="mx-1.5 size-2 rounded-full bg-accent" /> : null}
          {trailing}
        </span>
      ) : null}
    </li>
  );
}
