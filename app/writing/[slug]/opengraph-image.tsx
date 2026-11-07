import { getPost, getPosts } from "@/lib/posts";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "A post by Laurens Kersbergen";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

/** A post's link preview: its title and summary. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getPost(slug);
  return ogImage({ title: meta.title, subtitle: meta.summary });
}
