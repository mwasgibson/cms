import { http, withLatency, isMock } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { postsMock } from './mockBlog'

/**
 * Hotel backend Blog API
 *
 * GET    /blog/admin      -> Post[] (admin)
 * GET    /blog/admin/{id} -> Post (admin)
 * POST   /blog            -> Post (admin)
 * PUT    /blog/{id}       -> Post (admin)
 * DELETE /blog/{id}       -> moves the post to backend Trash (admin)
 *
 * Public endpoints are also available from the hotel backend, but this
 * service is used by the CMS admin feature, so admin endpoints are used
 * for listing and retrieving posts.
 *
 * Post shape:
 *   { id, title, slug, excerpt, content, featured_image, author_id,
 *     author_name, status, published_at, created_at }
 */

const listMock = async () => withLatency(postsMock.list())
const getMock = async (id) => withLatency(postsMock.get(id))
const createMock = async (data) => withLatency(postsMock.create(data))
const updateMock = async (id, data) => withLatency(postsMock.update(id, data))
const deleteMock = async (id) => withLatency(postsMock.remove(id))

export const listPosts = async (params = {}) => {
  if (isMock()) return listMock()
  const response = await http.get(API.POSTS_ADMIN, { params })
  return Array.isArray(response.data) ? response.data : response.data?.data ?? response.data
}

export const getPost = async (id) => {
  if (isMock()) return getMock(id)
  const response = await http.get(API.POST_ADMIN(id))
  return response.data?.data ?? response.data
}

export const createPost = async (data) => {
  if (isMock()) return createMock(data)
  const response = await http.post(API.POSTS, data)
  return response.data?.data ?? response.data
}

export const updatePost = async (id, data) => {
  if (isMock()) return updateMock(id, data)
  const response = await http.put(API.POST(id), data)
  return response.data?.data ?? response.data
}

export const deletePost = async (id) => {
  if (isMock()) return deleteMock(id)
  const response = await http.delete(API.POST(id))
  return response.data?.data ?? response.data
}

// Blog posts are restored through the backend Trash system. There is no
// /blog/:id/restore endpoint, so restoration should be handled from Trash.
export const restorePost = undefined
