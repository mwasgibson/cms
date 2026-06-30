import ProjectMilestone from './ProjectMilestone'

export default function MilestoneTimeline({ milestones = [], onEdit, onDelete, canEdit = true }) {
  const active = milestones.filter((m) => !m.deleted_at).sort((a, b) => new Date(a.date) - new Date(b.date))

  if (active.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-brand-100 py-12 text-center text-sm text-brand-500">
        No milestones yet. Add the first one above.
      </div>
    )
  }

  return (
    <ol className="relative space-y-5 border-l border-brand-100 pl-6">
      {active.map((m) => (
        <ProjectMilestone
          key={m.id}
          milestone={m}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </ol>
  )
}
