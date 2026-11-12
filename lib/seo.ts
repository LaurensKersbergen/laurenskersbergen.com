import type { Metadata } from "next";
import { siteDescription, siteName, siteTitle, siteUrl, socials, xHandle } from "@/lib/site";

/**
 * One page's metadata, complete: its title and description, its canonical URL and the same words
 * for link previews (Open Graph and X). Every page builds its metadata here, because in Next.js a
 * page's openGraph or twitter replaces the layout's whole object rather than merging into it, so
 * a page that set only some of it would drop the site name, locale and card type, and the
 * preview image with them. So each page names its image: the site's (app/opengraph-image.tsx), or
 * for a project or a post the one its own opengraph-image file draws.
 */
export function pageMetadata({
  title,
  description = siteDescription,
  path,
  article,
  image,
}: {
  /** Leave out on the homepage, which takes the site's own title. */
  title?: string;
  description?: string;
  /** The page's path, e.g. "/about": its canonical URL on www. */
  path: string;
  /** For a post: when it was published (and changed), so previews and search read it as an article. */
  article?: { publishedTime: string; modifiedTime?: string };
  /** The page's own preview image route, when it has one (e.g. "/projects/miro/opengraph-image"). */
  image?: string;
}): Metadata {
  const previewImage = { url: image ?? "/opengraph-image", width: 1200, height: 630, alt: title ? `${title} | ${siteName}` : siteTitle };
  const fullTitle = title ? `${title} | ${siteName}` : siteTitle;
  description = clip(description);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: "en_US",
      images: [previewImage],
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime, authors: [`${siteUrl}/about`] }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: xHandle,
      creator: xHandle,
      images: [previewImage],
    },
  };
}

/** Search results show about 160 characters of a description: longer ones end at a word, with "…". */
export function clip(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "")}…`;
}

/** Laurens, as structured data: one node the other pages' data points at by its @id. */
export const personId = `${siteUrl}/#person`;

export const person = {
  "@type": "Person",
  "@id": personId,
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/images/laurens-portrait.webp`,
  jobTitle: "Product Manager",
  worksFor: { "@type": "Organization", name: "Miro", url: "https://miro.com" },
  homeLocation: { "@type": "Place", name: "Amsterdam, Netherlands" },
  sameAs: socials.filter((social) => social.href.startsWith("http")).map((social) => social.href),
};

export const website = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  inLanguage: "en",
  publisher: { "@id": personId },
};
