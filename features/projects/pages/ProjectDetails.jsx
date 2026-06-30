import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import MilestoneTimeline from '../components/MilestoneTimeline'
import MilestoneForm from '../components/MilestoneForm'
import ProgressGallery from '../components/ProgressGallery'
import { useProject } from '../hooks/useProjects'
import { UNIT_STATUS_LABELS, UNIT_STATUS_COLOURS, UNIT_TYPE_LABELS, ROUTES } from '../../../utils/constants'
import { formatCurrency } from '../../../utils/formatters'
import { deleteProject } from '../services/projectService'
import { useToast } from '../../../hooks/useToast'
import { PROJECT_STATUS_LABELS } from '../../../utils/constants'
import { PROJECT_STATUS_BADGE_CLASSES } from '../utils/projectHelpers'
import { formatDate } from '../../../utils/formatters'

export default function ProjectDetails() {
  const { id } = useParams()
  const { project, units, loading, createMilestone, updateMilestone, deleteMilestone } = useProject(id)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState(null)
  const [milestoneDeleteTarget, setMilestoneDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)

  const openAddForm = () => {
    setEditingMilestone(null)
    setFormOpen(true)
  }

  const openEditForm = (milestone) => {
    setEditingMilestone(milestone)
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    setSaving(true)
    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id, payload)
        showToast('Milestone updated', 'success')
      } else {
        await createMilestone(payload)
        showToast('Milestone added', 'success')
      }
      setFormOpen(false)
      setEditingMilestone(null)
    } catch {
      showToast('Could not save this milestone. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleMilestoneDelete = async () => {
    setSaving(true)
    try {
      await deleteMilestone(milestoneDeleteTarget.id)
      showToast('Milestone deleted', 'success')
      setMilestoneDeleteTarget(null)
    } catch {
      showToast('Could not delete this milestone. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    setDeletingProject(true)
    try {
      await deleteProject(id)
      showToast('Project deleted', 'success')
      navigate('/admin/projects')
    } catch {
      showToast('Could not delete this project. Try again.', 'error')
    } finally {
      setDeletingProject(false)
      setConfirmDeleteProject(false)
    }
  }

  if (loading) return <Loader label="Loading project…" />
  if (!project) return <p className="text-sm text-brand-500">Project not found.</p>

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/projects" className="text-sm text-brand-500 hover:text-brand-900">
          ← Back to projects
        </Link>
        <div className="flex gap-3">
          <Link to={`/admin/projects/${id}/edit`}>
            <Button variant="ghost">Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => setConfirmDeleteProject(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-brand-900">{project.name}</h1>
            <p className="text-sm text-brand-500">{project.location}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${PROJECT_STATUS_BADGE_CLASSES[project.status]}`}
          >
            {PROJECT_STATUS_LABELS[project.status] ?? project.status}
          </span>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-brand-500">Construction progress</span>
            <span className="font-medium text-brand-900">{project.percent_complete}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-50">
            <div
              className="h-full rounded-full bg-accent-500 transition-all"
              style={{ width: `${project.percent_complete}%` }}
            />
          </div>
        </div>

        {project.expected_completion_date && (
          <p className="mt-4 text-sm text-brand-500">
            Expected completion:{' '}
            <span className="text-brand-900">{formatDate(project.expected_completion_date)}</span>
          </p>
        )}

        {project.description && (
          <p className="mt-4 border-t border-brand-100 pt-4 text-sm text-brand-900">
            {project.description}
          </p>
        )}
      </div>

      {/* Units belonging to this project */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-brand-900">
            Units <span className="ml-1 text-sm font-normal text-brand-500">({units.length})</span>
          </h2>
          <Link to={`${ROUTES.UNIT_NEW}?project_id=${id}`} className="text-sm font-medium text-accent-500 hover:underline">
            + Add unit to this project
          </Link>
        </div>
        {units.length === 0 ? (
          <div className="rounded-md border border-dashed border-brand-100 py-8 text-center text-sm text-brand-500">
            No units linked to this project yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-brand-100">
            <table className="min-w-full divide-y divide-brand-100 text-sm">
              <thead className="bg-brand-50">
                <tr>
                  {['Unit', 'Type', 'Floor', 'Price', 'ROI', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-brand-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {units.map((u) => (
                  <tr key={u.id} onClick={() => navigate(ROUTES.UNIT(u.id))} className="cursor-pointer hover:bg-brand-50">
                    <td className="px-4 py-3 font-medium text-brand-900">{u.name}</td>
                    <td className="px-4 py-3 text-brand-500">{UNIT_TYPE_LABELS[u.type] ?? u.type}</td>
                    <td className="px-4 py-3 text-brand-500">{u.floor}</td>
                    <td className="px-4 py-3 text-brand-900">{formatCurrency(u.price)}</td>
                    <td className="px-4 py-3 text-brand-900">{u.expected_roi}%</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${UNIT_STATUS_COLOURS[u.status]}`}>
                        {UNIT_STATUS_LABELS[u.status] ?? u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-900">Milestones</h2>
        <Button variant="accent" onClick={openAddForm}>
          + Add milestone
        </Button>
      </div>
      <div className="mt-3">
        <MilestoneTimeline
          milestones={project.milestones}
          onEdit={openEditForm}
          onDelete={setMilestoneDeleteTarget}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">
          Progress photos
        </h2>
        <ProgressGallery milestones={project.milestones} />
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingMilestone ? 'Edit milestone' : 'Add milestone'}
      >
        <MilestoneForm
          initialValues={editingMilestone}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={saving}
        />
      </Modal>

      <Modal
        open={!!milestoneDeleteTarget}
        onClose={() => setMilestoneDeleteTarget(null)}
        title="Delete this milestone?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setMilestoneDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={saving} onClick={handleMilestoneDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-brand-500">
          This removes <strong>{milestoneDeleteTarget?.title}</strong> from the timeline.
        </p>
      </Modal>

      <Modal
        open={confirmDeleteProject}
        onClose={() => setConfirmDeleteProject(false)}
        title="Delete this project?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDeleteProject(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deletingProject} onClick={handleDeleteProject}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-brand-500">
          This removes <strong>{project.name}</strong> and all its milestones permanently.
        </p>
      </Modal>
    </div>
  )
}
