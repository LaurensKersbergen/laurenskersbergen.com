"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Island } from "@kit/ui";
import { BookCall, bookingHref } from "@/components/book-call";
import { Kbd } from "@/components/kbd";

const sections = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
  { href: "/listening", label: "listening" },
];

export function SiteIsland() {
  const pathname = usePathname() ?? "/";
  const segment = `/${pathname.split("/")[1] ?? ""}`;
  const current = sections.find((section) => section.href === segment);

  return (
    <Island
      label="menu"
      closeLabel="close"
      shortcut="m"
      hint={<Kbd>m</Kbd>}
      path={pathname}
      links={[
        ...sections.map((section) => ({
          ...section,
          current: section === current,
          render: <Link href={section.href} />,
        })),
        /* On phones the header has no room for the button, so it's the menu's last row (site.css). */
        { href: bookingHref, label: "work with me", startsGroup: true, render: <BookCall className="island-book" /> },
      ]}
    />
  );
}
