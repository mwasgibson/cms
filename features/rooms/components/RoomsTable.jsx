import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import RoomStatusBadge from './RoomStatusBadge'
import { formatCurrency } from '../../../utils/formatters'

export default function RoomTable({ rooms, loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'room_number', header: 'Room #' },
    { key: 'room_type', header: 'Type' },
    { key: 'price', header: 'Price / night', render: (row) => formatCurrency(row.price) },
    { key: 'capacity', header: 'Capacity' },
    { key: 'status', header: 'Status', render: (row) => <RoomStatusBadge status={row.status} /> },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading rooms…</p>
  }

  return (
    <Table
      columns={columns}
      rows={rooms}
      emptyMessage="No rooms yet."
      onRowClick={(row) => navigate(`/admin/rooms/${row.room_number}/edit`)}
    />
  )
}