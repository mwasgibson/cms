import { useCallback, useEffect, useState } from 'react'
import {
  listProjects, getProject,
  createProject as createProjectReq, updateProject as updateProjectReq,
  deleteProject as deleteProjectReq,
  createMilestone as createMilestoneReq, updateMilestone as updateMilestoneReq,
  deleteMilestone as deleteMilestoneReq,
} from '../services/projectService'
import { listUnitsByProject } from '../../units/services/unitService'

// ─── List hook ───────────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tok, setTok] = useState(0)

  useEffect(() => {
    let cancelled = false
    listProjects()
      .then((d) => { if (!cancelled) setProjects(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tok])

  const refetch      = useCallback(() => { setLoading(true); setError(null); setTok((t) => t + 1) }, [])
  const createProject = useCallback(async (p) => { const r = await createProjectReq(p); setProjects((prev) => [...prev, r]); return r }, [])
  const updateProject = useCallback(async (id, p) => { const r = await updateProjectReq(id, p); setProjects((prev) => prev.map((x) => String(x.id) === String(id) ? r : x)); return r }, [])
  const deleteProject = useCallback(async (id) => { await deleteProjectReq(id); setProjects((prev) => prev.filter((x) => String(x.id) !== String(id))) }, [])

  return { projects, loading, error, refetch, createProject, updateProject, deleteProject }
}

// ─── Single-project hook ─────────────────────────────────────────────────────
export function useProject(id) {
  const [project, setProject] = useState(null)
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    Promise.all([getProject(id), listUnitsByProject(id)])
      .then(([proj, projUnits]) => {
        if (!cancelled) {
          setProject({
            ...proj,
            milestones: (proj.milestones ?? []).filter((m) => !m.deleted_at),
          })
          setUnits(projUnits)
        }
      })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  // ── Milestone CRUD ──────────────────────────────────────────────────────────
  const createMilestone = useCallback(async (payload) => {
    const m = await createMilestoneReq(id, payload)
    setProject((prev) => ({ ...prev, milestones: [...(prev.milestones ?? []), m] }))
    return m
  }, [id])

  const updateMilestone = useCallback(async (mid, payload) => {
    const m = await updateMilestoneReq(id, mid, payload)
    setProject((prev) => ({
      ...prev,
      milestones: prev.milestones.map((x) => String(x.id) === String(mid) ? m : x),
    }))
    return m
  }, [id])

  const deleteMilestone = useCallback(async (mid) => {
    await deleteMilestoneReq(id, mid)
    // Soft-delete: remove from visible list
    setProject((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((x) => String(x.id) !== String(mid)),
    }))
  }, [id])

  // ── Project-level update ────────────────────────────────────────────────────
  const updateOverview = useCallback(async (payload) => {
    const updated = await updateProjectReq(id, payload)
    setProject((prev) => ({ ...prev, ...updated }))
    return updated
  }, [id])

  return { project, units, loading, error, updateOverview, createMilestone, updateMilestone, deleteMilestone }
}
