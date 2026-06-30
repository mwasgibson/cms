import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import Loader from '../../../components/Loader'
import { useProject } from '../hooks/useProjects'
import { updateProject } from '../services/projectService'
import { useToast } from '../../../hooks/useToast'

export default function EditProject() {
  const { id } = useParams()
  const { project, loading } = useProject(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await updateProject(id, payload)
      showToast('Project updated', 'success')
      navigate(`/admin/projects/${id}`)
    } catch {
      showToast('Could not save changes. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Loading project…" />
  if (!project) return <p className="text-sm text-brand-500">Project not found.</p>

  return (
    <div>
      <Link to={`/admin/projects/${id}`} className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to project
      </Link>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        Edit {project.name}
      </h1>
      <ProjectForm initialValues={project} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}
