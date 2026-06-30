import { Link } from 'react-router-dom'
import Button from '../../../components/Button'
import { useProjects } from '../hooks/useProjects'
import ProjectTable from '../components/ProjectTable'
import ProjectStats from '../components/ProjectStats'
import { usePermission } from '../../../hooks/usePermission'
import { ROUTES } from '../../../utils/constants'

export default function Projects() {
  const { projects, loading, error } = useProjects()
  const perms = usePermission().for('projects')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Projects</h1>
          <p className="text-sm text-brand-500">{projects.length} development{projects.length === 1 ? '' : 's'}</p>
        </div>
        {perms.canCreate && <Link to={ROUTES.PROJECT_NEW}><Button variant="accent">+ Add project</Button></Link>}
      </div>

      <ProjectStats projects={projects} />

      {error && <p className="mb-4 text-sm text-red-600">Couldn't load projects. Try refreshing.</p>}
      <ProjectTable projects={projects} loading={loading} />
    </div>
  )
}
