import { Link } from 'react-router-dom'
import Button from '../../../components/Button'
import { useRooms } from '../hooks/useRooms'
import RoomsTable from '../components/RoomsTable'
import { usePermission } from '../../../hooks/usePermission'
import { ROUTES } from '../../../utils/constants'

export default function Rooms() {
  const { rooms, loading, error } = useRooms()
  const perms = usePermission().for('rooms')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Rooms</h1>
          <p className="text-sm text-brand-500">{rooms.length} room{rooms.length === 1 ? '' : 's'}</p>
        </div>
        {perms.canCreate && <Link to={ROUTES.ROOM_NEW}><Button variant="accent">+ Add room</Button></Link>}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">Couldn't load rooms. Try refreshing.</p>}
      <RoomsTable rooms={rooms} loading={loading} />
    </div>
  )
}