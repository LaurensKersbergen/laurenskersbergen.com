import Moment from "react-moment"
import PostType from "../../types/post"
import { getPostBySlug } from "../../utils/posts"

// PostPage page component
const PostPage = ({
  post
}: {
  /**
   *
   */
  post: PostType
}) => {
  // Render post title and content in the page from props
  return (
    <main className="flex-1 pb-16 md:pb-20 lg:pb-24">
      <section className="content mt-12 md:mt-16 lg:mt-104">
        <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>
        <p className="mt-2 text-light-400 dark:text-light-300">
          <Moment format="MMMM D, YYYY" withTitle>
            {post.published_at}
          </Moment>
        </p>
        <div
          className="post-content my-6"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </section>
    </main>
  )
}

/**
 * @param root0
 * @param root0.params
 */
export async function getServerSideProps({
  params
}: {
  /**
   *
   */
  params: any
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: { post }
  }
}

export default PostPage
