import { Activity } from "../components/sections/Activity"
import { Introduction } from "../components/sections/Introduction"
import { Posts } from "../components/sections/Posts"
import { Projects } from "../components/sections/Projects"
import { Work } from "../components/sections/Work"
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
function Page({ posts }: Props) {
  return (
    <main className="flex-1 pb-16 md:pb-20 lg:pb-24">
      <Introduction className="content mt-12 md:mt-16 lg:mt-20" />
      <Posts posts={posts} />
      <Work className="mt-16 md:mt-20 lg:mt-24" />
      <Projects className="mt-16 md:mt-20 lg:mt-24" />
      <Activity className="content mt-16 md:mt-20 lg:mt-24" />
    </main>
  )
}

Page.getInitialProps = async ({
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

export default Page
