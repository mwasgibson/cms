import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useToast } from '../../../hooks/useToast'

export default function SeoSettingsForm({ initialValues, onSubmit }) {
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
      showToast('SEO settings saved', 'success')
    } catch {
      showToast('Could not save settings. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">SEO</h2>
      <p className="mb-5 text-sm text-brand-500">
        Meta tags used on the public site — these are the same fields already live on
        pandatowers.africa, now editable here instead of hardcoded.
      </p>

      <div className="flex flex-col gap-4">
        <Input
          id="meta_title"
          name="meta_title"
          label="Meta title"
          value={form.meta_title}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="meta_description" className="text-sm font-medium text-brand-900">
            Meta description
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            rows={3}
            value={form.meta_description}
            onChange={handleChange}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <Input
          id="meta_keywords"
          name="meta_keywords"
          label="Meta keywords"
          placeholder="comma, separated, keywords"
          value={form.meta_keywords}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="og_image_url"
            name="og_image_url"
            label="Social share image URL"
            placeholder="https://…"
            value={form.og_image_url}
            onChange={handleChange}
          />
          <Input
            id="twitter_handle"
            name="twitter_handle"
            label="Twitter handle"
            placeholder="@handle"
            value={form.twitter_handle}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="submit" loading={saving}>
          Save SEO settings
        </Button>
      </div>
    </form>
  )
}
