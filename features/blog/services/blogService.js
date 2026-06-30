import { createResource } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { postsMock } from './mockBlog'

/**
 * Laravel API contract:
 *   GET    /posts       -> Post[]   (admin: all; public: status=published only)
 *   GET    /posts/{id}  -> Post
 *   POST   /posts       -> Post
 *   PUT    /posts/{id}  -> Post
 *   DELETE /posts/{id}  -> 204   (soft delete)
 *   PATCH  /posts/{id}/restore -> Post
 *
 * Post shape:
 *   { id, title, slug, excerpt, content, featured_image, status,
 *     seo_title, seo_description, published_at, created_at, deleted_at }
 */

const resource = createResource('posts', postsMock, {
  list:   () => API.POSTS,
  get:    (id) => API.POST(id),
  create: () => API.POSTS,
  update: (id) => API.POST(id),
  remove: (id) => API.POST(id),
})

export const listPosts   = (p) => resource.list(p)
export const getPost     = (id) => resource.get(id)
export const createPost  = (d) => resource.create(d)
export const updatePost  = (id, d) => resource.update(id, d)
export const deletePost  = (id) => resource.remove(id)
export const restorePost = (id) => resource.restore(id)
