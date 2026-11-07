import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPosts, getPost } from "@/lib/posts";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { clip, pageMetadata, personId } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

/* Only the posts that exist: any other address under /writing is a 404, not an empty page. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = getPost(slug);
    return pageMetadata({
      title: meta.title,
      description: meta.summary,
      path: `/writing/${slug}`,
      article: { publishedTime: meta.date },
      image: `/writing/${slug}/opengraph-image`,
    });
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  return (
    <article className="page-column ends-on-text enter">
      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: post.meta.title,
          description: clip(post.meta.summary),
          datePublished: post.meta.date,
          dateModified: post.meta.date,
          url: `${siteUrl}/writing/${slug}`,
          mainEntityOfPage: `${siteUrl}/writing/${slug}`,
          image: `${siteUrl}/writing/${slug}/opengraph-image`,
          inLanguage: "en",
          author: { "@type": "Person", "@id": personId, name: siteName, url: siteUrl },
          publisher: { "@id": personId },
        }}
      />
      <header className="mb-[45px] max-md:mb-6">
        <h1 className="text-title mb-2">{post.meta.title}</h1>
        <time dateTime={post.meta.date} className="text-(--muted)">
          {formatDate(post.meta.date)}
        </time>
      </header>
      <div className="prose enter [--enter-start:1]">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
