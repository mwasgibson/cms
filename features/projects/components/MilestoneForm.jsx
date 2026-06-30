import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { MILESTONE_STATUS, MILESTONE_STATUS_LABELS } from '../../../utils/constants'
import { isRequired } from '../../../utils/validators'

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  status: MILESTONE_STATUS.UPCOMING,
}

export default function MilestoneForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {
      title: isRequired(form.title),
      date: isRequired(form.date),
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="title"
        name="title"
        label="Milestone title"
        placeholder="e.g. Roofing complete"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          value={form.date}
          onChange={handleChange}
          error={errors.date}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-brand-900">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {Object.entries(MILESTONE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-brand-900">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save milestone
        </Button>
      </div>
    </form>
  )
}
