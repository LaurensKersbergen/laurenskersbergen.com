import Author from "./author"

interface PostType {
  /**
   *
   */
  author: Author
  /**
   *
   */
  content: string
  /**
   *
   */
  date: string
  /**
   *
   */
  excerpt: string
  /**
   *
   */
  feature_image: string
  /**
   *
   */
  html: string
  /**
   *
   */
  ogImage: {
    /**
     *
     */
    url: string
  }
  /**
   *
   */
  published_at: string
  /**
   *
   */
  slug: string
  /**
   *
   */
  title: string
}

export default PostType
