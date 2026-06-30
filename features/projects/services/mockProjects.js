import { PROJECT_STATUS, MILESTONE_STATUS } from '../../../utils/constants'
import { withLatency } from '../../../utils/mockMode'

const STORAGE_KEY = 'pt_mock_projects'

const SEED = [
  {
    id: 1, name: 'Panda Towers 001',
    description: 'Premium residential investment development in Nairobi offering 7-9% rental yields.',
    location: 'Waiyaki Way, Nairobi', status: PROJECT_STATUS.IN_PROGRESS,
    percent_complete: 62, expected_completion_date: '2027-03-31',
    created_at: '2025-09-01T09:00:00Z', deleted_at: null,
    milestones: [
      { id: 1, title: 'Groundbreaking',           description: 'Site cleared and groundbreaking ceremony held.', date: '2025-09-15', status: MILESTONE_STATUS.COMPLETED,   images: [], deleted_at: null },
      { id: 2, title: 'Foundation complete',       description: 'Raft foundation poured and cured.',             date: '2025-12-10', status: MILESTONE_STATUS.COMPLETED,   images: [], deleted_at: null },
      { id: 3, title: 'Slab casting — Floors 1-7', description: 'Structural slabs cast for the first 7 floors.', date: '2026-04-20', status: MILESTONE_STATUS.COMPLETED,   images: [], deleted_at: null },
      { id: 4, title: 'Slab casting — Floors 8-14', description: 'Upper floor structural works.',                date: '2026-07-30', status: MILESTONE_STATUS.IN_PROGRESS, images: [], deleted_at: null },
      { id: 5, title: 'Roofing & external works',  description: 'Roofing, plastering, and façade works.',        date: '2026-10-15', status: MILESTONE_STATUS.UPCOMING,    images: [], deleted_at: null },
      { id: 6, title: 'Handover',                  description: 'Final finishes, inspections, unit handovers.',  date: '2027-03-31', status: MILESTONE_STATUS.UPCOMING,    images: [], deleted_at: null },
    ],
  },
  {
    id: 2, name: 'Panda Towers 002',
    description: 'Second development in the Panda Towers series — site selection in progress.',
    location: 'Nairobi, Kenya', status: PROJECT_STATUS.PLANNING,
    percent_complete: 0, expected_completion_date: '',
    created_at: '2026-06-01T09:00:00Z', deleted_at: null, milestones: [],
  },
]

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || JSON.parse(JSON.stringify(SEED)) }
  catch { return JSON.parse(JSON.stringify(SEED)) }
}
function save(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }

let npid = 1000, nmid = 1000

function findIdx(d, id) {
  const i = d.findIndex(p => String(p.id) === String(id))
  if (i === -1) throw Object.assign(new Error('Project not found'), { status: 404 })
  return i
}

export const projectsMock = {
  list:    async ()      => withLatency(load().filter(p => !p.deleted_at)),
  get:     async (id)   => { const d=load(); const i=findIdx(d,id); return withLatency({...d[i]}) },
  create:  async (p)    => { const d=load(); const n={id:npid++,milestones:[],created_at:new Date().toISOString(),deleted_at:null,...p}; d.push(n); save(d); return withLatency(n) },
  update:  async (id,p) => { const d=load(); const i=findIdx(d,id); d[i]={...d[i],...p}; save(d); return withLatency(d[i]) },
  remove:  async (id)   => { const d=load(); const i=findIdx(d,id); d[i].deleted_at=new Date().toISOString(); save(d); return withLatency(null) },
  restore: async (id)   => { const d=load(); const i=findIdx(d,id); d[i].deleted_at=null; save(d); return withLatency(d[i]) },
  listDeleted: async () => withLatency(load().filter(p => p.deleted_at).sort((a,b) => new Date(b.deleted_at)-new Date(a.deleted_at))),

  createMilestone: async (pid, p) => {
    const d=load(); const i=findIdx(d,pid)
    const m={id:nmid++,images:[],deleted_at:null,...p}
    d[i].milestones.push(m); save(d); return withLatency(m)
  },
  updateMilestone: async (pid, mid, p) => {
    const d=load(); const i=findIdx(d,pid)
    const mi=d[i].milestones.findIndex(m=>String(m.id)===String(mid))
    if(mi===-1) throw new Error('Milestone not found')
    d[i].milestones[mi]={...d[i].milestones[mi],...p}; save(d); return withLatency(d[i].milestones[mi])
  },
  deleteMilestone: async (pid, mid) => {
    const d=load(); const i=findIdx(d,pid)
    const mi=d[i].milestones.findIndex(m=>String(m.id)===String(mid))
    if(mi!==-1){d[i].milestones[mi].deleted_at=new Date().toISOString(); save(d)}
    return withLatency(null)
  },
}
