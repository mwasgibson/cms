import { MILESTONE_STATUS_LABELS, MILESTONE_STATUS_COLOURS } from '../../../utils/constants'
import { formatDate } from '../../../utils/formatters'
import Button from '../../../components/Button'

export default function ProjectMilestone({ milestone, onEdit, onDelete, canEdit = true }) {
  return (
    <li className="relative">
      <span className="absolute -left-[29px] top-1.5 size-3 rounded-full border-2 border-white bg-accent-500" />
      <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-brand-500">{formatDate(milestone.date)}</p>
            <h3 className="font-display text-base font-semibold text-brand-900">{milestone.title}</h3>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${MILESTONE_STATUS_COLOURS[milestone.status]}`}>
            {MILESTONE_STATUS_LABELS[milestone.status] ?? milestone.status}
          </span>
        </div>

        {milestone.description && (
          <p className="mt-2 text-sm text-brand-900">{milestone.description}</p>
        )}

        {milestone.images?.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {milestone.images.map((src, i) => (
              <img key={i} src={src} alt="" className="size-16 rounded-md object-cover shrink-0 border border-brand-100" />
            ))}
          </div>
        )}

        {canEdit && (
          <div className="mt-3 flex gap-3">
            <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit?.(milestone)}>Edit</Button>
            <Button variant="ghost" className="px-2 py-1 text-xs text-red-600 hover:bg-red-50" onClick={() => onDelete?.(milestone)}>Delete</Button>
          </div>
        )}
      </div>
    </li>
  )
}
