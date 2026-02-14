import type { Metadata } from "next";
import { STIX_Two_Text } from "next/font/google";
import { GeistMono } from "geist/font/mono";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${stix.variable} ${GeistMono.variable}`}>
      <body className="mx-auto min-h-screen" style={{ maxWidth: 650, padding: "4rem 2rem" }}>
        <main>{children}</main>
      </body>
    </html>
  );
}
