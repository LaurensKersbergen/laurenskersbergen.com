"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn, stringClass } from "./cn";

/* Avatar: a photo, or initials while it loads or when there is none. */

/** Initials from the type scale, about 40% of the avatar, so every size stays on the design system. */
const initialsSize = (size: number) =>
  size <= 32 ? "text-xs" : size <= 44 ? "text-control-sm" : size <= 56 ? "text-base" : size <= 72 ? "text-xl" : "text-2xl";

export function Avatar({ name, src, size = 32 }: { name: string; src?: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <BaseAvatar.Root
      className={cn("inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-fill font-medium text-ink-2", initialsSize(size))}
      style={{ width: size, height: size }}
    >
      {src ? <BaseAvatar.Image src={src} alt={name} className="size-full object-cover" /> : null}
      <BaseAvatar.Fallback delay={src ? 400 : 0}>{initials}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export function Separator({ className, ...props }: ComponentProps<typeof BaseSeparator>) {
  return (
    <BaseSeparator
      className={cn(
        "shrink-0 bg-line data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        stringClass(className),
      )}
      {...props}
    />
  );
}
