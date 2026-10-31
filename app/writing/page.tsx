import Link from "next/link";
import { getPosts, type PostMeta } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on product, design, and development.",
};

/** Posts grouped by the year they were published, newest year first (posts arrive newest first). */
function groupByYear(posts: PostMeta[]) {
  const groups: { year: string; posts: PostMeta[] }[] = [];
  for (const post of posts) {
    const year = /^\d{4}/.test(post.date) ? post.date.slice(0, 4) : "Undated";
    const group = groups.find((g) => g.year === year);
    if (group) group.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}

export default function WritingPage() {
  const groups = groupByYear(getPosts());

  return (
    <div className="page-column">
      <h1 className="text-title my-6.5">Writing</h1>
      {groups.length === 0 ? (
        <p className="text-(--muted)">No posts yet.</p>
      ) : (
        groups.map(({ year, posts }) => (
          <section key={year} aria-labelledby={`year-${year}`} className="mb-9">
            <h2 id={`year-${year}`} className="text-subheading mb-5.5 tabular-nums">
              {year}
            </h2>
            <ul className="text-row">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className="text-(--fg)">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
