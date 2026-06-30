import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useToast } from '../../../hooks/useToast'

export default function GeneralSettingsForm({ initialValues, onSubmit }) {
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
      showToast('General settings saved', 'success')
    } catch {
      showToast('Could not save settings. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">General</h2>
      <p className="mb-5 text-sm text-brand-500">Site identity.</p>

      <Input
        id="site_name"
        name="site_name"
        label="Site name"
        value={form.site_name}
        onChange={handleChange}
      />

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="submit" loading={saving}>
          Save general settings
        </Button>
      </div>
    </form>
  )
}
