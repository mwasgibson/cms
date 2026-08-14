import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PostForm from '../components/PostForm'
import { createPost } from '../services/blogService'
import { useToast } from '../../../hooks/useToast'

export default function AddPost() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await createPost(payload)
      showToast('Post saved', 'success')
      navigate('/admin/blog')
    } catch {
      showToast('Could not save this post. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link to="/admin/blog" className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to posts
      </Link>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        New post
      </h1>
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}
