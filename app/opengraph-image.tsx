import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Laurens Kersbergen, product manager in Amsterdam";
export const size = ogSize;
export const contentType = ogContentType;

/** The site's link preview, for every page without one of its own. */
export default function Image() {
  return ogImage({
    title: "Laurens Kersbergen",
    subtitle: "Product manager in Amsterdam. Databases and AI at Miro; before that, growth at KPN and a company of my own.",
  });
}
