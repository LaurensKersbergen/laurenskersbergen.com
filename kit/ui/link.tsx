import { cloneElement, type ReactElement, type ReactNode } from "react";
import { cn } from "./cn";

/** A router link to render instead of <a>, e.g. Next.js <Link href="/garden" />. */
export type LinkRender = ReactElement<{ className?: string; children?: ReactNode }>;

/**
 * Base UI's `render` convention for links, as shadcn/ui's Breadcrumb and Item use it: pass the
 * app's router link and it gets our classes and content, so navigation doesn't reload the page.
 * Without it, a plain <a>. No hooks (unlike useRender), so server components can use it.
 */
export function LinkOrAnchor({
  href,
  render,
  className,
  children,
  ...rest
}: {
  href?: string;
  render?: LinkRender;
  className: string;
  children: ReactNode;
  "aria-current"?: "page" | undefined;
  onPointerDown?: React.PointerEventHandler<HTMLElement>;
}) {
  if (render) return cloneElement(render, { ...rest, className: cn(className, render.props.className), children });
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
