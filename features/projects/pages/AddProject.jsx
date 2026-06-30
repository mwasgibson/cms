import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import { createProject } from '../services/projectService'
import { useToast } from '../../../hooks/useToast'

export default function AddProject() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const project = await createProject(payload)
      showToast('Project added', 'success')
      navigate(`/admin/projects/${project.id}`)
    } catch {
      showToast('Could not save this project. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link to="/admin/projects" className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to projects
      </Link>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        Add project
      </h1>
      <ProjectForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}
