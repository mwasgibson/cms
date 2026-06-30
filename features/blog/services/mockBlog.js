import { POST_STATUS } from '../../../utils/constants'
import { withLatency } from '../../../utils/mockMode'

const STORAGE_KEY = 'pt_mock_posts'

const SEED = [
  { id: 1, title: "Why Nairobi Is Kenya\u2019s Next Real Estate Investment Hotspot", slug: 'why-nairobi-is-kenyas-next-real-estate-investment-hotspot', excerpt: "A look at the demand drivers behind Nairobi\u2019s rising residential investment appeal.", content: "Nairobi\u2019s residential market has seen steady demand growth...", featured_image: '', status: POST_STATUS.PUBLISHED, seo_title: '', seo_description: '', published_at: '2026-05-20T09:00:00Z', created_at: '2026-05-18T14:00:00Z', deleted_at: null },
  { id: 2, title: "Understanding Rental Yield: A Beginner\u2019s Guide", slug: 'understanding-rental-yield-a-beginners-guide', excerpt: "What rental yield actually means, how it\u2019s calculated, and why it matters.", content: "Rental yield is one of the most important numbers...", featured_image: '', status: POST_STATUS.PUBLISHED, seo_title: '', seo_description: '', published_at: '2026-06-02T09:00:00Z', created_at: '2026-05-30T11:00:00Z', deleted_at: null },
  { id: 3, title: 'Panda Towers 001 Construction Update \u2014 Q2 2026', slug: 'panda-towers-001-construction-update-q2-2026', excerpt: 'Where things stand on site as structural works move into the upper floors.', content: 'Construction at Panda Towers 001 continues to track well...', featured_image: '', status: POST_STATUS.DRAFT, seo_title: '', seo_description: '', published_at: null, created_at: '2026-06-15T10:00:00Z', deleted_at: null },
]

function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [...SEED] } catch { return [...SEED] } }
function save(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }
let nid = 1000

export const postsMock = {
  list:    async ()       => withLatency(load().filter(p => !p.deleted_at).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))),
  get:     async (id)    => { const p=load().find(p=>String(p.id)===String(id)); if(!p) throw Object.assign(new Error('Not found'),{status:404}); return withLatency({...p}) },
  create:  async (p)     => { const d=load(); const becomesPublished=p.status===POST_STATUS.PUBLISHED&&!p.published_at; const n={id:nid++,created_at:new Date().toISOString(),deleted_at:null,...p,published_at:becomesPublished?new Date().toISOString():p.published_at}; d.push(n); save(d); return withLatency(n) },
  update:  async (id,p)  => { const d=load(); const i=d.findIndex(x=>String(x.id)===String(id)); if(i===-1) throw new Error('Not found'); const becomesPublished=p.status===POST_STATUS.PUBLISHED&&!d[i].published_at; d[i]={...d[i],...p,published_at:becomesPublished?new Date().toISOString():(p.published_at??d[i].published_at)}; save(d); return withLatency(d[i]) },
  remove:  async (id)    => { const d=load(); const i=d.findIndex(x=>String(x.id)===String(id)); if(i!==-1){d[i].deleted_at=new Date().toISOString();save(d)}; return withLatency(null) },
  restore: async (id)    => { const d=load(); const i=d.findIndex(x=>String(x.id)===String(id)); if(i!==-1){d[i].deleted_at=null;save(d);return withLatency(d[i])} },
  listDeleted: async ()    => withLatency(load().filter(p => p.deleted_at).sort((a,b) => new Date(b.deleted_at)-new Date(a.deleted_at))),
}
