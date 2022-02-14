import Image from "next/image"
import Link from "next/link"
import Moment from "react-moment"
import PostType from "../types/post"
import { getPosts } from "../utils/posts"

interface Props {
  /**
   *
   */
  posts?: Array<PostType>
}
/**
 * The index page component.
 *
 * @param root0
 * @param root0.posts
 */
function WritingPage({ posts }: Props) {
  return (
    <main className="flex-1 bg-light pb-16 dark:bg-black md:pb-20 lg:pb-24">
      <section className="content mx-auto mt-16 md:mt-20 lg:mt-104">
        {posts?.map((post: PostType, idx: number) => {
          return (
            <Link href={`/writing/${post.slug}`} key={`${idx}-post`}>
              <a className="mb-9 block rounded-lg border border-white bg-white p-5 dark:border-dark dark:bg-dark">
                {post.feature_image && (
                  <div className="mb-4">
                    <Image
                      alt={post.title}
                      className=" w-full overflow-hidden rounded-lg object-cover"
                      height="322"
                      priority
                      src={post.feature_image}
                      width="768"
                    />
                  </div>
                )}
                <p className="font-semibold text-black dark:text-white">
                  {post.title}
                </p>
                <p className="my-2 text-neutral-700 dark:text-light-300">
                  {post.excerpt}
                </p>
                <p className="mt-2 text-light-400 dark:text-light-300">
                  <Moment format="MMMM D, YYYY" withTitle>
                    {post.published_at}
                  </Moment>
                </p>
              </a>
            </Link>
          )
        })}
      </section>
    </main>
  )
}

WritingPage.getInitialProps = async ({
  res
}: {
  /**
   *
   */
  res: any
}) => {
  if (res) {
    const cacheAge = 60 * 60 * 12
    res.setHeader("Cache-Control", `public,s-maxage=${cacheAge}`)
  }
  const posts = await getPosts()
  return { posts: posts }
}

export default WritingPage
