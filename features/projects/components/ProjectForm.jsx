import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from '../../../utils/constants'
import { isRequired } from '../../../utils/validators'

const EMPTY_FORM = {
  name: '',
  description: '',
  location: '',
  status: PROJECT_STATUS.PLANNING,
  percent_complete: 0,
  expected_completion_date: '',
}

export default function ProjectForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {
      name: isRequired(form.name),
      location: isRequired(form.location),
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...form,
      percent_complete: Number(form.percent_complete) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <Input
        id="name"
        name="name"
        label="Project name"
        placeholder="e.g. Panda Towers 002"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        id="location"
        name="location"
        label="Location"
        placeholder="e.g. Nairobi, Kenya"
        value={form.location}
        onChange={handleChange}
        error={errors.location}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="percent_complete"
          name="percent_complete"
          type="number"
          min="0"
          max="100"
          label="Percent complete"
          value={form.percent_complete}
          onChange={handleChange}
        />
        <Input
          id="expected_completion_date"
          name="expected_completion_date"
          type="date"
          label="Expected completion"
          value={form.expected_completion_date}
          onChange={handleChange}
        />
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
        <Button type="submit" loading={submitting}>
          Save project
        </Button>
      </div>
    </form>
  )
}
