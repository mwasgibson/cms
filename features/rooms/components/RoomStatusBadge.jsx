const STATUS_LABELS = {
  available: 'Available',
  reserved: 'Reserved',
  occupied: 'Occupied',
  cleaning: 'Cleaning',
  maintenance: 'Maintenance',
}

const STATUS_CLASSES = {
  available: 'bg-emerald-50 text-emerald-700',
  reserved: 'bg-amber-50 text-amber-700',
  occupied: 'bg-blue-50 text-blue-700',
  cleaning: 'bg-purple-50 text-purple-700',
  maintenance: 'bg-red-50 text-red-700',
}

export default function RoomStatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[status] ?? 'bg-brand-100 text-brand-500'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}