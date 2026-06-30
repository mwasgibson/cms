import { Link } from 'react-router-dom'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLOURS, ROUTES } from '../../../utils/constants'
import { formatDate } from '../../../utils/formatters'

export default function ProjectCard({ project }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={ROUTES.PROJECT(project.id)} className="font-display text-lg font-semibold text-brand-900 hover:text-accent-500">
            {project.name}
          </Link>
          <p className="text-sm text-brand-500">{project.location}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${PROJECT_STATUS_COLOURS[project.status]}`}>
          {PROJECT_STATUS_LABELS[project.status] ?? project.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-brand-500">Construction</span>
          <span className="font-medium text-brand-900">{project.percent_complete}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-sand-100">
          <div
            className="h-full rounded-full bg-accent-500 transition-all"
            style={{ width: `${project.percent_complete}%` }}
          />
        </div>
      </div>

      {project.expected_completion_date && (
        <p className="mt-3 text-xs text-brand-500">
          Expected: <span className="text-brand-900">{formatDate(project.expected_completion_date)}</span>
        </p>
      )}

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-brand-900">{project.description}</p>
      )}
    </div>
  )
}
