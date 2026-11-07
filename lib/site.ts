/** The handles the footer links to. Each one is checked against a profile Laurens owns. */
export const socials = [
  { label: "@lvkersbergen", href: "https://x.com/lvkersbergen" },
  { label: "GitHub", href: "https://github.com/LaurensKersbergen" },
  { label: "Email", href: "mailto:hey@laurenskersbergen.com" },
] as const;

export const email = "hey@laurenskersbergen.com";

/**
 * The Cal.com event the "work with me" button books, as "username/event-slug" (cal.com/username/
 * event-slug). Set NEXT_PUBLIC_CAL_LINK once the account exists; until then the button writes an
 * email instead, so it works either way.
 */
export const calLink = process.env.NEXT_PUBLIC_CAL_LINK?.trim().replace(/^https?:\/\/cal\.com\//, "") ?? "";

/**
 * Where the site lives: www, since the bare domain redirects there. Canonical URLs, the sitemap,
 * robots.txt, social previews and structured data all use it, so nothing points at a redirect.
 */
export const siteUrl = "https://www.laurenskersbergen.com";

export const siteName = "Laurens Kersbergen";

/** The homepage's title, and the default for anything without one of its own. */
export const siteTitle = "Laurens Kersbergen, product manager in Amsterdam";

export const siteDescription =
  "Laurens Kersbergen is a product manager in Amsterdam, working on databases and AI at Miro. Before that, growth at KPN and a company of his own.";

export const xHandle = "@lvkersbergen";
