"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * "Laurens K" in the top-left corner, dressed as the collapsed menu across from it (.ui-island-pill),
 * linking home. It sits level with the menu but scrolls away with the page.
 */
export function SiteName() {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-current={pathname === "/" ? "page" : undefined}
      className="ui-island-pill absolute top-[calc(20px+env(safe-area-inset-top))] left-[calc(20px+env(safe-area-inset-left))] z-30 min-[45.0625rem]:top-8 min-[45.0625rem]:left-9"
    >
      Laurens K
    </Link>
  );
}
