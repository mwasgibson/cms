import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import RoomsForm from '../components/RoomsForm'
import { useRoom } from '../hooks/useRooms'
import { updateRoom, deleteRoom } from '../services/roomService'
import { useToast } from '../../../hooks/useToast'
import Button from '../../../components/Button'
import { usePermission } from '../../../hooks/usePermission'
import { ROUTES } from '../../../utils/constants'

export default function EditRoom() {
  const { roomNumber } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { room, loading } = useRoom(roomNumber)
  const perms = usePermission().for('rooms')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await updateRoom(roomNumber, payload)
      showToast('Room updated', 'success')
      navigate(ROUTES.ROOMS)
    } catch (err) {
      showToast(err.message || 'Could not save this room. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete room ${roomNumber}? This cannot be undone.`)) return
    try {
      await deleteRoom(roomNumber)
      showToast('Room deleted', 'success')
      navigate(ROUTES.ROOMS)
    } catch (err) {
      showToast(err.message || 'Could not delete this room.', 'error')
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-brand-500">Loading room…</p>
  if (!room) return <p className="py-10 text-center text-sm text-brand-500">Room not found.</p>

  return (
    <div>
      <Link to={ROUTES.ROOMS} className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to rooms
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Edit room {roomNumber}</h1>
        {perms.canDelete && <Button variant="danger" onClick={handleDelete}>Delete room</Button>}
      </div>
      <RoomsForm initialValues={room} onSubmit={handleSubmit} submitting={submitting} isEdit />
    </div>
  )
}