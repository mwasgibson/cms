import { Link } from 'react-router-dom'
import Button from '../../../components/Button'
import { useFetch } from '../../../hooks/useFetch'
import { listPosts } from '../services/blogService'
import PostTable from '../components/PostTable'

export default function Posts() {
  const { data: posts, loading, error } = useFetch(listPosts)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Blog</h1>
        <Link to="/admin/blog/new">
          <Button variant="accent">+ New post</Button>
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">Couldn't load posts. Try refreshing.</p>
      )}

      <PostTable posts={posts ?? []} loading={loading} />
    </div>
  )
}
