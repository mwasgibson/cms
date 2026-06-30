import { LEAD_STATUS, LEAD_SOURCE } from '../../../utils/constants'
import { withLatency } from '../../../utils/mockMode'

const STORAGE_KEY = 'pt_mock_leads'

const SEED = [
  { id: 1, name: 'Wanjiru Kamau', email: 'wanjiru@example.com', phone: '+254712345001', message: 'Interested in 2-bedroom units, what is the payment plan?', unit_interest: '2br', source: LEAD_SOURCE.WEBSITE_FORM, status: LEAD_STATUS.NEW, site_visit_date: null, notes: [], created_at: '2026-06-12T09:30:00Z', deleted_at: null },
  { id: 2, name: 'David Otieno',  email: 'david@example.com',   phone: '+254722345002', message: 'Would like to book a site visit this weekend.',            unit_interest: 'penthouse', source: LEAD_SOURCE.SITE_VISIT_REQUEST, status: LEAD_STATUS.SITE_VISIT_BOOKED, site_visit_date: '2026-06-22T10:00:00Z', notes: [{ text: 'Confirmed via phone.', created_at: '2026-06-13T08:00:00Z' }], created_at: '2026-06-11T14:05:00Z', deleted_at: null },
  { id: 3, name: 'Amina Hassan',  email: 'amina@example.com',   phone: '+254733345003', message: 'Referred by investor, asking about rental yield projections.', unit_interest: '1br', source: LEAD_SOURCE.REFERRAL, status: LEAD_STATUS.CONTACTED, site_visit_date: null, notes: [{ text: 'Sent yield breakdown via email.', created_at: '2026-06-10T11:20:00Z' }], created_at: '2026-06-09T16:45:00Z', deleted_at: null },
  { id: 4, name: 'Brian Mwangi',  email: 'brian@example.com',   phone: '+254744345004', message: 'Walked into the show unit, wants to reserve Unit C7.',     unit_interest: '2br', source: LEAD_SOURCE.WALK_IN, status: LEAD_STATUS.CONVERTED, site_visit_date: '2026-06-05T09:00:00Z', notes: [{ text: 'Paid reservation deposit.', created_at: '2026-06-07T13:00:00Z' }], created_at: '2026-06-04T10:00:00Z', deleted_at: null },
  { id: 5, name: 'Grace Njeri',   email: 'grace@example.com',   phone: '+254755345005', message: 'Asked for the brochure, went quiet after.',                unit_interest: 'studio', source: LEAD_SOURCE.WEBSITE_FORM, status: LEAD_STATUS.LOST, site_visit_date: null, notes: [{ text: 'Followed up twice, no response.', created_at: '2026-06-02T12:00:00Z' }], created_at: '2026-05-28T08:15:00Z', deleted_at: null },
]

function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [...SEED] } catch { return [...SEED] } }
function save(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }
let nid = 1000

export const leadsMock = {
  list:    async ()             => withLatency(load().filter(l => !l.deleted_at)),
  get:     async (id)          => { const l = load().find(l => String(l.id)===String(id)); if(!l) throw Object.assign(new Error('Not found'),{status:404}); return withLatency({...l}) },
  create:  async (p)           => { const d=load(); const n={id:nid++,status:LEAD_STATUS.NEW,notes:[],site_visit_date:null,created_at:new Date().toISOString(),deleted_at:null,...p}; d.push(n); save(d); return withLatency(n) },
  update:  async (id,p)        => { const d=load(); const i=d.findIndex(l=>String(l.id)===String(id)); if(i===-1) throw new Error('Not found'); d[i]={...d[i],...p}; save(d); return withLatency(d[i]) },
  remove:  async (id)          => { const d=load(); const i=d.findIndex(l=>String(l.id)===String(id)); if(i!==-1){d[i].deleted_at=new Date().toISOString();save(d)}; return withLatency(null) },
  restore: async (id)          => { const d=load(); const i=d.findIndex(l=>String(l.id)===String(id)); if(i!==-1){d[i].deleted_at=null;save(d);return withLatency(d[i])} },
  listDeleted: async ()    => withLatency(load().filter(l => l.deleted_at).sort((a,b) => new Date(b.deleted_at)-new Date(a.deleted_at))),
}
