import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import PostForm from '../components/PostForm'
import Loader from '../../../components/Loader'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import { useFetch } from '../../../hooks/useFetch'
import { getPost, updatePost, deletePost } from '../services/blogService'
import { useToast } from '../../../hooks/useToast'

export default function EditPost() {
  const { id } = useParams()
  const { data: post, loading } = useFetch(() => getPost(id), [id])
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await updatePost(id, payload)
      showToast('Post updated', 'success')
      navigate('/admin/blog')
    } catch {
      showToast('Could not save changes. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(id)
      showToast('Post moved to trash', 'success')
      navigate('/admin/blog')
    } catch {
      showToast('Could not move this post to trash. Try again.', 'error')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) return <Loader label="Loading post…" />
  if (!post) return <p className="text-sm text-brand-500">Post not found.</p>

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/blog" className="text-sm text-brand-500 hover:text-brand-900">
          ← Back to posts
        </Link>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
      </div>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        Edit post
      </h1>
      <PostForm initialValues={post} onSubmit={handleSubmit} submitting={submitting} />

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Move this post to trash?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Move to trash
            </Button>
          </>
        }
      >
        <p className="text-sm text-brand-500">
          <strong>{post.title}</strong> will be moved to Trash. You can restore it from there.
        </p>
      </Modal>
    </div>
  )
}
