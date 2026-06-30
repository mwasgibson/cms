import { useState } from 'react'
import Loader from '../../../components/Loader'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useFetch } from '../../../hooks/useFetch'
import { getContent, updateSection } from '../services/contentService'
import { useToast } from '../../../hooks/useToast'

// ─── Reusable section wrapper ────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <h3 className="font-display text-lg font-semibold text-brand-900">{title}</h3>
      {description && <p className="mb-5 mt-1 text-sm text-brand-500">{description}</p>}
      {children}
    </div>
  )
}

// ─── Textarea helper ─────────────────────────────────────────────────────────
function Textarea({ id, label, rows = 3, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-brand-900">{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
      />
    </div>
  )
}

// ─── SaveButton ──────────────────────────────────────────────────────────────
function SaveButton({ loading }) {
  return (
    <div className="mt-5 flex justify-end">
      <Button type="submit" loading={loading}>Save</Button>
    </div>
  )
}

// ─── TAB: Hero ───────────────────────────────────────────────────────────────
function HeroTab({ initial, onSave }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave('hero', form); showToast('Hero section saved', 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Section title="Hero" description="The main banner at the top of the home page.">
        <div className="space-y-4">
          <Textarea id="headline" label="Headline" value={form.headline} onChange={set('headline')} />
          <Input id="subheadline" label="Subheadline" value={form.subheadline} onChange={set('subheadline')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="cta_primary" label="Primary CTA" value={form.cta_primary} onChange={set('cta_primary')} />
            <Input id="cta_secondary" label="Secondary CTA" value={form.cta_secondary} onChange={set('cta_secondary')} />
          </div>
          <Input id="badge" label="Badge text" value={form.badge} onChange={set('badge')} />
        </div>
        <SaveButton loading={saving} />
      </Section>
    </form>
  )
}

// ─── TAB: About ──────────────────────────────────────────────────────────────
function AboutTab({ initial, onSave }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave('about', form); showToast('About section saved', 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Section title="About" description="Shown on the About page and in the About section of Home.">
        <div className="space-y-4">
          <Textarea id="tagline" label="Project tagline" rows={3} value={form.tagline} onChange={set('tagline')} />
          <Textarea id="developer_description" label="Developer description" rows={3} value={form.developer_description} onChange={set('developer_description')} />
          <Input id="mission" label="Mission statement" value={form.mission} onChange={set('mission')} />
          <Textarea id="vision" label="Vision" rows={3} value={form.vision} onChange={set('vision')} />
        </div>
        <SaveButton loading={saving} />
      </Section>
    </form>
  )
}

// ─── TAB: Investment ─────────────────────────────────────────────────────────
function InvestmentTab({ initial, onSave }) {
  const [calc, setCalc] = useState(initial.investment_calculator)
  const [plans, setPlans] = useState(initial.payment_plans)
  const [specs, setSpecs] = useState(initial.project_specs)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const setC = (k) => (e) => setCalc((f) => ({ ...f, [k]: e.target.value }))
  const setP = (k) => (e) => setPlans((f) => ({ ...f, [k]: e.target.value }))
  const setS = (k) => (e) => setSpecs((f) => ({ ...f, [k]: e.target.value }))

  const saveSection = async (section, data, label) => {
    setSaving(true)
    try { await onSave(section, data); showToast(`${label} saved`, 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); saveSection('investment_calculator', calc, 'Calculator') }}>
        <Section title="Investment Calculator" description="Numbers powering the calculator on the Investment page.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="studio_price" name="studio_price" label="Studio price (KES)" type="number" value={calc.studio_price} onChange={setC('studio_price')} />
            <Input id="studio_monthly_rent" label="Studio monthly rent (KES)" type="number" value={calc.studio_monthly_rent} onChange={setC('studio_monthly_rent')} />
            <Input id="studio_yield_range" label="Studio yield range" value={calc.studio_yield_range} onChange={setC('studio_yield_range')} />
            <Input id="onebr_price" label="1BR price (KES)" type="number" value={calc.onebr_price} onChange={setC('onebr_price')} />
            <Input id="onebr_monthly_rent" label="1BR monthly rent (KES)" type="number" value={calc.onebr_monthly_rent} onChange={setC('onebr_monthly_rent')} />
            <Input id="onebr_yield_range" label="1BR yield range" value={calc.onebr_yield_range} onChange={setC('onebr_yield_range')} />
            <Input id="gross_yield_headline" label="Gross yield headline (%)" type="number" step="0.1" value={calc.gross_yield_headline} onChange={setC('gross_yield_headline')} />
          </div>
          <SaveButton loading={saving} />
        </Section>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); saveSection('payment_plans', plans, 'Payment plans') }}>
        <Section title="Payment Plans" description="Pricing for each payment phase — studio and 1BR.">
          <div className="mb-3 text-xs text-brand-500">Studio</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input label="All Cash (KES)" type="number" value={plans.all_cash_studio} onChange={setP('all_cash_studio')} />
            <Input label="Early Bird (KES)" type="number" value={plans.early_bird_studio} onChange={setP('early_bird_studio')} />
            <Input label="Phase 1 (KES)" type="number" value={plans.phase1_studio} onChange={setP('phase1_studio')} />
          </div>
          <div className="mb-3 text-xs text-brand-500">1 Bedroom</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input label="All Cash (KES)" type="number" value={plans.all_cash_onebr} onChange={setP('all_cash_onebr')} />
            <Input label="Early Bird (KES)" type="number" value={plans.early_bird_onebr} onChange={setP('early_bird_onebr')} />
            <Input label="Phase 1 (KES)" type="number" value={plans.phase1_onebr} onChange={setP('phase1_onebr')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Studio reservation fee (KES)" type="number" value={plans.reservation_fee_studio} onChange={setP('reservation_fee_studio')} />
            <Input label="1BR reservation fee (KES)" type="number" value={plans.reservation_fee_onebr} onChange={setP('reservation_fee_onebr')} />
            <Input label="Deposit %" type="number" value={plans.deposit_percent} onChange={setP('deposit_percent')} />
          </div>
          <SaveButton loading={saving} />
        </Section>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); saveSection('project_specs', specs, 'Project specs') }}>
        <Section title="Project Specs" description="Core facts shown across FAQ, About, and Investment pages.">
          <div className="space-y-4">
            <Input label="Floors description" value={specs.floors} onChange={setS('floors')} />
            <Textarea label="Construction period" value={specs.construction_period} onChange={setS('construction_period')} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Location" value={specs.location} onChange={setS('location')} />
              <Input label="Expected completion" value={specs.expected_completion} onChange={setS('expected_completion')} />
              <Input label="Groundbreaking" value={specs.groundbreaking} onChange={setS('groundbreaking')} />
            </div>
          </div>
          <SaveButton loading={saving} />
        </Section>
      </form>
    </div>
  )
}

// ─── TAB: FAQ ────────────────────────────────────────────────────────────────
function FaqTab({ initial, onSave }) {
  const [items, setItems] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const update = (id, key, value) =>
    setItems((prev) => prev.map((q) => (q.id === id ? { ...q, [key]: value } : q)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave('faq', items); showToast('FAQ saved', 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Section title="FAQ" description={`${items.length} questions — edit answers freely.`}>
        <div className="space-y-6">
          {items.map((q) => (
            <div key={q.id} className="border-b border-brand-100 pb-6 last:border-0 last:pb-0">
              <Input
                label="Question"
                value={q.question}
                onChange={(e) => update(q.id, 'question', e.target.value)}
              />
              <div className="mt-3">
                <Textarea
                  label="Answer"
                  rows={3}
                  value={q.answer}
                  onChange={(e) => update(q.id, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <SaveButton loading={saving} />
      </Section>
    </form>
  )
}

// ─── TAB: Track Record ───────────────────────────────────────────────────────
function TrackRecordTab({ initial, onSave }) {
  const [items, setItems] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const update = (id, key, value) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave('track_record', items); showToast('Track record saved', 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Section title="Track Record" description="Past developments shown on the About page.">
        <div className="space-y-6">
          {items.map((p) => (
            <div key={p.id} className="grid grid-cols-1 gap-3 border-b border-brand-100 pb-6 last:border-0 last:pb-0 sm:grid-cols-2">
              <Input label="Name" value={p.name} onChange={(e) => update(p.id, 'name', e.target.value)} />
              <Input label="Type" value={p.type} onChange={(e) => update(p.id, 'type', e.target.value)} />
              <Input label="Location" value={p.location} onChange={(e) => update(p.id, 'location', e.target.value)} />
              <Input label="Units / size" value={p.units} onChange={(e) => update(p.id, 'units', e.target.value)} />
            </div>
          ))}
        </div>
        <SaveButton loading={saving} />
      </Section>
    </form>
  )
}

// ─── TAB: SEO ────────────────────────────────────────────────────────────────
function SeoTab({ initial, onSave }) {
  const pages = ['home', 'about', 'investment', 'faq', 'blog', 'contact']
  const [data, setData] = useState(initial)
  const [saving, setSaving] = useState(null)
  const { showToast } = useToast()

  const update = (slug, key, value) =>
    setData((prev) => ({ ...prev, [slug]: { ...prev[slug], [key]: value } }))

  const savePage = async (e, slug) => {
    e.preventDefault()
    setSaving(slug)
    try { await onSave(`seo_${slug}`, data[slug]); showToast(`${slug} SEO saved`, 'success') }
    catch { showToast('Could not save. Try again.', 'error') }
    finally { setSaving(null) }
  }

  return (
    <div className="space-y-4">
      {pages.map((slug) => (
        <form key={slug} onSubmit={(e) => savePage(e, slug)}>
          <Section title={`/${slug}`}>
            <div className="space-y-3">
              <Input label="Meta title" value={data[slug]?.meta_title ?? ''} onChange={(e) => update(slug, 'meta_title', e.target.value)} />
              <Textarea label="Meta description" rows={2} value={data[slug]?.meta_description ?? ''} onChange={(e) => update(slug, 'meta_description', e.target.value)} />
              <Input label="Meta keywords" value={data[slug]?.meta_keywords ?? ''} onChange={(e) => update(slug, 'meta_keywords', e.target.value)} />
              <Input label="Social share image URL" value={data[slug]?.og_image_url ?? ''} onChange={(e) => update(slug, 'og_image_url', e.target.value)} />
            </div>
            <SaveButton loading={saving === slug} />
          </Section>
        </form>
      ))}
    </div>
  )
}

// ─── TABS DEFINITION ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',         label: 'Hero' },
  { id: 'about',        label: 'About' },
  { id: 'investment',   label: 'Investment' },
  { id: 'faq',          label: 'FAQ' },
  { id: 'track_record', label: 'Track Record' },
  { id: 'seo',          label: 'SEO' },
]

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function Content() {
  const { data: content, loading, error, setData: setContent } = useFetch(getContent)
  const [activeTab, setActiveTab] = useState('hero')

  const handleSave = async (section, payload) => {
    await updateSection(section, payload)
    setContent((prev) => {
      if (section.startsWith('seo_')) {
        const slug = section.replace('seo_', '')
        return { ...prev, seo: { ...prev.seo, [slug]: payload } }
      }
      return { ...prev, [section]: payload }
    })
  }

  if (loading) return <Loader label="Loading content…" />
  if (error) return <p className="text-sm text-red-600">Couldn't load content. Try refreshing.</p>

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Content</h1>
        <p className="text-sm text-brand-500">
          Edit what's on the live site — copy, pricing, FAQ, SEO. Changes go live once the
          public site is updated to fetch these fields from the API.
        </p>
      </div>

      {/* Tab nav */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-white text-brand-900 hover:bg-sand-100 border border-brand-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'hero' && <HeroTab initial={content.hero} onSave={handleSave} />}
      {activeTab === 'about' && <AboutTab initial={content.about} onSave={handleSave} />}
      {activeTab === 'investment' && (
        <InvestmentTab
          initial={{
            investment_calculator: content.investment_calculator,
            payment_plans: content.payment_plans,
            project_specs: content.project_specs,
          }}
          onSave={handleSave}
        />
      )}
      {activeTab === 'faq' && <FaqTab initial={content.faq} onSave={handleSave} />}
      {activeTab === 'track_record' && <TrackRecordTab initial={content.track_record} onSave={handleSave} />}
      {activeTab === 'seo' && <SeoTab initial={content.seo} onSave={handleSave} />}
    </div>
  )
}
