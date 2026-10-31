import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPosts, getPost } from "@/lib/posts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = getPost(slug);
    return {
      title: meta.title,
      description: meta.summary,
    };
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
    <article className="page-column enter">
      <header className="mb-7">
        <h1 className="text-title mt-6.5 mb-1">{post.meta.title}</h1>
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
