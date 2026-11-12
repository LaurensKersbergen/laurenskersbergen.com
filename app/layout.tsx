import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteIsland } from "@/components/site-island";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { LiquidGlass } from "@/components/liquid-glass";
import { HeaderBookCall, SiteName } from "@/components/site-name";
import { UISounds } from "@/components/ui-sounds";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

/* The site-wide defaults; each page adds its own title, description and canonical URL through
   pageMetadata (lib/seo.ts). Relative URLs in any page's metadata resolve against siteUrl. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

// Lets the floating menu sit above the iPhone home indicator with env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/* Set before the first paint: scripts run, so blocks may wait to reveal themselves (site.css). */
const motionFlag = `document.documentElement.setAttribute('data-motion','');`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body className="min-h-screen">
        {/* The first stop for a keyboard: straight past the header to the page's own content. */}
        <a href="#main" className="skip-link">
          skip to content
        </a>
        <header>
          <SiteName />
          <HeaderBookCall />
          <SiteIsland />
          <LiquidGlass />
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
        <KeyboardShortcuts />
        <UISounds />
      </body>
    </html>
  );
}
