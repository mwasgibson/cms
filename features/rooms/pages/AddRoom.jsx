import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RoomsForm from '../components/RoomsForm'
import { createRoom } from '../services/roomService'
import { useToast } from '../../../hooks/useToast'
import { ROUTES } from '../../../utils/constants'

export default function AddRoom() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await createRoom(payload)
      showToast('Room added', 'success')
      navigate(ROUTES.ROOMS)
    } catch (err) {
      showToast(err.message || 'Could not save this room. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link to={ROUTES.ROOMS} className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to rooms
      </Link>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        Add room
      </h1>
      <RoomsForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}