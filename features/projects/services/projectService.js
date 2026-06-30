import { createResource, http, isMock } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { projectsMock } from './mockProjects'

/**
 * Laravel API contract:
 *   GET    /projects                           -> Project[]
 *   GET    /projects/{id}                      -> Project (includes milestones[] and units[])
 *   POST   /projects                           -> Project
 *   PUT    /projects/{id}                      -> Project
 *   DELETE /projects/{id}                      -> 204   (soft delete)
 *   PATCH  /projects/{id}/restore              -> Project
 *   POST   /projects/{id}/milestones           -> Milestone
 *   PUT    /projects/{id}/milestones/{mid}     -> Milestone
 *   DELETE /projects/{id}/milestones/{mid}     -> 204   (soft delete)
 *   GET    /projects/{id}/units                -> Unit[] (units belonging to this project)
 *
 * Project shape:
 *   { id, name, description, location, status, percent_complete,
 *     expected_completion_date, created_at, deleted_at,
 *     milestones: Milestone[], units: Unit[] }
 */

const resource = createResource('projects', projectsMock, {
  list:   () => API.PROJECTS,
  get:    (id) => API.PROJECT(id),
  create: () => API.PROJECTS,
  update: (id) => API.PROJECT(id),
  remove: (id) => API.PROJECT(id),
})

export const listProjects   = (p) => resource.list(p)
export const getProject     = (id) => resource.get(id)
export const createProject  = (d) => resource.create(d)
export const updateProject  = (id, d) => resource.update(id, d)
export const deleteProject  = (id) => resource.remove(id)
export const restoreProject = (id) => resource.restore(id)

export async function createMilestone(projectId, payload) {
  if (isMock()) return projectsMock.createMilestone(projectId, payload)
  const { data } = await http.post(API.MILESTONE(projectId), payload)
  return data
}

export async function updateMilestone(projectId, milestoneId, payload) {
  if (isMock()) return projectsMock.updateMilestone(projectId, milestoneId, payload)
  const { data } = await http.put(API.MILESTONE(projectId, milestoneId), payload)
  return data
}

export async function deleteMilestone(projectId, milestoneId) {
  if (isMock()) return projectsMock.deleteMilestone(projectId, milestoneId)
  await http.delete(API.MILESTONE(projectId, milestoneId))
}
