import type { Metadata, Viewport } from "next";
import { STIX_Two_Text } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteIsland } from "@/components/site-island";
import { UISounds } from "@/components/ui-sounds";
import "./globals.css";

const stix = STIX_Two_Text({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laurenskersbergen.com"),
  title: {
    default: "Laurens Kersbergen",
    template: "%s — Laurens Kersbergen",
  },
  description:
    "Product manager living in Amsterdam. Currently working at Miro.",
  openGraph: {
    title: "Laurens Kersbergen",
    description:
      "Product manager living in Amsterdam. Currently working at Miro.",
    url: "https://laurenskersbergen.com",
    siteName: "Laurens Kersbergen",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Lets the floating menu sit above the iPhone home indicator with env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${stix.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="mx-auto min-h-screen" style={{ maxWidth: 650, padding: "4rem 2rem" }}>
        {/* Clear space at the bottom for the floating menu: its height, its offset and the safe area. */}
        <main className="pb-[calc(--spacing(11)_+_--spacing(4)_+_env(safe-area-inset-bottom))]">{children}</main>
        <SiteIsland />
        <UISounds />
      </body>
    </html>
  );
}
