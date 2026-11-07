import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Any address that isn't a page: answered with a 404 and a way back in. */
export default function NotFound() {
  return (
    <div className="page-column">
      <h1 className="display-xl mb-[42px] max-[62rem]:mb-[45px] max-md:mb-6">Page not found</h1>
      <p className="mb-8 text-(--muted)">This page doesn&apos;t exist, or it moved.</p>
      <Link href="/" className="pill pill--strong">
        Back to the homepage
      </Link>
    </div>
  );
}
