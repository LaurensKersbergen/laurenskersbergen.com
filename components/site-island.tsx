"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Island } from "@kit/ui";

const sections = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects", startsGroup: true },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/listening", label: "Listening", startsGroup: true },
];

export function SiteIsland() {
  const pathname = usePathname() ?? "/";
  const segment = `/${pathname.split("/")[1] ?? ""}`;
  const current = sections.find((section) => section.href === segment);

  return (
    <Island
      label="Menu"
      path={pathname}
      links={sections.map((section) => ({
        ...section,
        current: section === current,
        render: <Link href={section.href} />,
      }))}
    />
  );
}
