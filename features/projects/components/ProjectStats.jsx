import { PROJECT_STATUS } from '../../../utils/constants'

export default function ProjectStats({ projects = [] }) {
  const active      = projects.filter((p) => !p.deleted_at)
  const inProgress  = active.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length
  const planning    = active.filter((p) => p.status === PROJECT_STATUS.PLANNING).length
  const completed   = active.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length
  const totalMilestones  = active.reduce((s, p) => s + (p.milestones?.length ?? 0), 0)
  const doneMilestones   = active.reduce((s, p) => s + (p.milestones?.filter((m) => m.status === 'completed' && !m.deleted_at).length ?? 0), 0)

  const tiles = [
    { label: 'Total projects',   value: active.length },
    { label: 'In Progress',      value: inProgress, accent: true },
    { label: 'Planning',         value: planning },
    { label: 'Completed',        value: completed },
    { label: 'Milestones done',  value: `${doneMilestones}/${totalMilestones}` },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-brand-100 bg-white shadow-sm px-4 py-3">
          <p className="text-xs text-brand-500">{t.label}</p>
          <p className={`mt-1 font-display text-xl font-semibold ${t.accent ? 'text-accent-500' : 'text-brand-900'}`}>
            {t.value}
          </p>
        </div>
      ))}
    </div>
  )
}
