import Link from "next/link"
import Moment from "react-moment"
import PostType from "../../types/post"

interface Props {
  /**
   *
   */
  posts?: Array<PostType>
}
/**
 * A Safari-like browser window.
 *
 * @param props - A set of `div` props.
 * @param [props.url] - The browser's current URL.
 * @param [props.children] - The browser's content.
 * @param [props.className] - A list of one or more classes.
 */

/**
 * An iPhone-like device.
 *
 * @param props - A set of `div` props.
 * @param [props.children] - The browser's content.
 * @param [props.className] - A list of one or more classes.
 */

/**
 * A section displaying my latest listens and watches.
 *
 * @param props - A set of `section` props.
 * @param props.posts
 * @param props.className
 * @param className
 */
export function Posts({ posts }: Props) {
  return (
    <section className="mt-16 md:mt-20 lg:mt-24">
      <div className="content mb-8">
        <h2 className="mb-2 text-xl">Writing</h2>
        <div className="mt-6 space-y-6">
          {posts?.slice(0, 3).map((post: PostType, idx: number) => {
            return (
              <div key={`${idx}-post`}>
                <Link href={`/writing/${post.slug}`}>
                  <a className="font-medium text-black hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600">
                    {post.title}
                  </a>
                </Link>
                <p className="mt-3 text-light-400 dark:text-light-300">
                  <Moment format="MMMM D, YYYY" withTitle>
                    {post.published_at}
                  </Moment>
                </p>
              </div>
            )
          })}
        </div>

        <Link href="/writing">
          <a className="mt-8 flex h-6 rounded-lg leading-6 text-neutral-700 dark:text-white">
            Read all posts &rarr;
          </a>
        </Link>
      </div>
    </section>
  )
}
