import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useToast } from '../../../hooks/useToast'

export default function ContactSettingsForm({ initialValues, onSubmit }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(initialValues)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(form)
      showToast('Contact settings saved', 'success')
    } catch {
      showToast('Could not save settings. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">Contact</h2>
      <p className="mb-5 text-sm text-brand-500">How investors reach you.</p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            label="Contact email"
            value={form.contact_email}
            onChange={handleChange}
          />
          <Input
            id="contact_phone"
            name="contact_phone"
            label="Contact phone"
            value={form.contact_phone}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            label="WhatsApp number"
            value={form.whatsapp_number}
            onChange={handleChange}
          />
          <Input
            id="address"
            name="address"
            label="Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="submit" loading={saving}>
          Save contact settings
        </Button>
      </div>
    </form>
  )
}
