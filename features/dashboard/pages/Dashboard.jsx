import { Link } from 'react-router-dom'
import { useRooms } from '../../rooms/hooks/useRooms'
import { useDeals } from '../../deals/hooks/useDeals'
import { ROUTES } from '../../../utils/constants'

function StatCard({ label, value, to }) {
  const content = (
    <div className="rounded-lg border border-brand-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm text-brand-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-brand-900">{value}</p>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const { rooms, loading: roomsLoading } = useRooms()
  const { deals, loading: dealsLoading } = useDeals()

  const availableRooms = rooms.filter((r) => r.status === 'available').length
  const today = new Date().toISOString().slice(0, 10)
  const activeDeals = deals.filter((d) => d.active && d.end_date >= today).length

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total rooms" value={roomsLoading ? '—' : rooms.length} to={ROUTES.ROOMS} />
        <StatCard label="Available now" value={roomsLoading ? '—' : availableRooms} to={ROUTES.ROOMS} />
        <StatCard label="Total deals" value={dealsLoading ? '—' : deals.length} to={ROUTES.DEALS} />
        <StatCard label="Active deals" value={dealsLoading ? '—' : activeDeals} to={ROUTES.DEALS} />
      </div>
    </div>
  )
}