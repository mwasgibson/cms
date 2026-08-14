import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useToast } from '../../../hooks/useToast'

export default function SocialLinksForm({ initialValues, onSubmit }) {
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
      showToast('Social links saved', 'success')
    } catch {
      showToast('Could not save settings. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">Social Links</h2>
      <p className="mb-5 text-sm text-brand-500">Shown in the site footer and contact sections.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="facebook_url"
          name="facebook_url"
          label="Facebook"
          placeholder="https://…"
          value={form.facebook_url}
          onChange={handleChange}
        />
        <Input
          id="instagram_url"
          name="instagram_url"
          label="Instagram"
          placeholder="https://…"
          value={form.instagram_url}
          onChange={handleChange}
        />
        <Input
          id="twitter_url"
          name="twitter_url"
          label="X / Twitter"
          placeholder="https://…"
          value={form.twitter_url}
          onChange={handleChange}
        />
        <Input
          id="linkedin_url"
          name="linkedin_url"
          label="LinkedIn"
          placeholder="https://…"
          value={form.linkedin_url}
          onChange={handleChange}
        />
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="submit" loading={saving}>
          Save social links
        </Button>
      </div>
    </form>
  )
}
