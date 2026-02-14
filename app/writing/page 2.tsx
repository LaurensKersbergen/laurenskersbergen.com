import Link from "next/link";
import { getPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on product, design, and development.",
};

export default function WritingPage() {
  const posts = getPosts();

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-medium mb-8" style={{ lineHeight: "3.25rem" }}>Writing</h1>
      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="block no-underline group"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium group-hover:underline underline-offset-4">
                    {post.title}
                  </span>
                  <span
                    className="text-sm shrink-0 tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {formatDate(post.date)}
                  </span>
                </div>
                {post.summary && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--muted)" }}
                  >
                    {post.summary}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
