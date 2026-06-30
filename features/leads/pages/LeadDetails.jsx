import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import { useFetch } from '../../../hooks/useFetch'
import { getLead, updateLead, deleteLead } from '../services/leadService'
import { useToast } from '../../../hooks/useToast'
import {
  LEAD_STATUS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_ORDER,
  LEAD_SOURCE_LABELS,
  UNIT_TYPE_LABELS,
} from '../../../utils/constants'
import { LEAD_STATUS_BADGE_CLASSES } from '../utils/leadHelpers'
import { formatDate } from '../../../utils/formatters'

function toLocalInputValue(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16)
}

// Only ever mounted once `lead` is loaded, so the lazy useState initializers
// below are safe — no risk of syncing against a still-null lead.
function LeadPipeline({ lead, onSave, saving }) {
  const [status, setStatus] = useState(lead.status)
  const [visitDate, setVisitDate] = useState(toLocalInputValue(lead.site_visit_date))

  const handleStatusSave = () => onSave({ status }, 'Status updated')

  const handleScheduleVisit = () => {
    const iso = visitDate ? new Date(visitDate).toISOString() : null
    const nextStatus = iso ? LEAD_STATUS.SITE_VISIT_BOOKED : status
    setStatus(nextStatus)
    onSave({ site_visit_date: iso, status: nextStatus }, iso ? 'Site visit scheduled' : 'Updated')
  }

  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-5">
      <h3 className="font-display text-lg font-semibold text-brand-900">Pipeline</h3>

      <div className="mt-4 flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-medium text-brand-500">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {LEAD_STATUS_ORDER.map((value) => (
              <option key={value} value={value}>
                {LEAD_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleStatusSave} loading={saving} variant="ghost">
          Update
        </Button>
      </div>

      <div className="mt-5 border-t border-brand-100 pt-5">
        <label htmlFor="visit-date" className="text-xs font-medium text-brand-500">
          Site visit date
        </label>
        <div className="mt-1.5 flex items-end gap-3">
          <input
            id="visit-date"
            type="datetime-local"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="flex-1 rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <Button onClick={handleScheduleVisit} loading={saving} variant="accent">
            Schedule
          </Button>
        </div>
        {lead.site_visit_date && (
          <p className="mt-2 text-xs text-brand-500">
            Currently booked: {formatDate(lead.site_visit_date)}
          </p>
        )}
      </div>
    </div>
  )
}

function LeadNotesSection({ lead, onAddNote, saving }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAddNote(trimmed)
    setText('')
  }

  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-5">
      <h3 className="font-display text-lg font-semibold text-brand-900">Notes</h3>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Log a call, email, or update…"
          className="flex-1 rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <Button type="submit" loading={saving}>
          Add
        </Button>
      </form>

      <div className="mt-5 space-y-3 border-t border-brand-100 pt-5">
        {(!lead.notes || lead.notes.length === 0) && (
          <p className="text-sm text-brand-500">No notes yet.</p>
        )}
        {[...(lead.notes ?? [])].reverse().map((note, i) => (
          <div key={i} className="text-sm">
            <p className="text-brand-900">{note.text}</p>
            <p className="text-xs text-brand-500">{formatDate(note.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LeadDetails() {
  const { id } = useParams()
  const { data: lead, loading, setData: setLead } = useFetch(() => getLead(id), [id])
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const persist = async (payload, successMessage) => {
    setSaving(true)
    try {
      const updated = await updateLead(id, payload)
      setLead(updated)
      showToast(successMessage, 'success')
    } catch {
      showToast('Could not save that change. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = (text) => {
    const notes = [...(lead.notes ?? []), { text, created_at: new Date().toISOString() }]
    persist({ notes }, 'Note added')
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteLead(id)
      showToast('Lead deleted', 'success')
      navigate('/admin/leads')
    } catch {
      showToast('Could not delete this lead. Try again.', 'error')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) return <Loader label="Loading lead…" />
  if (!lead) return <p className="text-sm text-brand-500">Lead not found.</p>

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/leads" className="text-sm text-brand-500 hover:text-brand-900">
          ← Back to leads
        </Link>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-brand-900">{lead.name}</h2>
                <p className="text-sm text-brand-500">
                  {lead.email} · {lead.phone}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${LEAD_STATUS_BADGE_CLASSES[lead.status]}`}
              >
                {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-100 pt-5">
              <div>
                <p className="text-xs text-brand-500">Interested in</p>
                <p className="text-sm font-medium text-brand-900">
                  {UNIT_TYPE_LABELS[lead.unit_interest] ?? 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-500">Source</p>
                <p className="text-sm font-medium text-brand-900">
                  {LEAD_SOURCE_LABELS[lead.source] ?? lead.source}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-500">Received</p>
                <p className="text-sm font-medium text-brand-900">{formatDate(lead.created_at)}</p>
              </div>
            </div>

            {lead.message && (
              <p className="mt-5 border-t border-brand-100 pt-5 text-sm text-brand-900">
                {lead.message}
              </p>
            )}
          </div>

          <LeadNotesSection lead={lead} onAddNote={handleAddNote} saving={saving} />
        </div>

        <LeadPipeline lead={lead} onSave={persist} saving={saving} />
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this lead?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-brand-500">
          This removes <strong>{lead.name}</strong>'s record permanently. This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
