"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Island } from "@kit/ui";

const sections = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

// The site's floating menu: the four sections, matched by the first path segment, so
// /projects/<slug> is in Projects. Pages outside them (such as /listening) show "Menu".
export function SiteIsland() {
  const pathname = usePathname() ?? "/";
  const segment = `/${pathname.split("/")[1] ?? ""}`;
  const current = sections.find((section) => section.href === segment);

  return (
    <Island
      label={current?.label ?? "Menu"}
      path={pathname}
      links={sections.map((section) => ({
        ...section,
        current: section === current,
        render: <Link href={section.href} />,
      }))}
    />
  );
}
