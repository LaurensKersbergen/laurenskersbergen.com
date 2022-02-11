import GhostContentAPI from "@tryghost/content-api"

const data: {
  /**
   *
   */
  ghostPath?: string
  /**
   *
   */
  host?: any
  /**
   *
   */
  key: string
  /**
   *
   */
  url: string
  /**
   *
   */
  version: string
} = {
  url: "https://laurens-kersbergen.ghost.io",
  key: "3e39cf57d555953239786ff1f5",
  version: "v3"
}

const api = GhostContentAPI(data)
/**
 *
 */
export async function getPosts() {
  return await api.posts
    .browse({
      limit: "all"
    })
    .catch(
      (error: {
        /**
         *
         */
        error: any
      }) => {
        console.error(error)
      }
    )
}

/**
 * @param slug
 * @param slug.slug
 */
export async function getPostBySlug(slug: {
  /**
   *
   */
  slug: string
}) {
  return await api.posts
    .read({
      slug
    })
    .catch(
      (error: {
        /**
         *
         */
        error: any
      }) => {
        console.error(error)
      }
    )
}
