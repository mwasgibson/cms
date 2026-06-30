import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { UNIT_STATUS, UNIT_STATUS_LABELS, UNIT_TYPES, UNIT_TYPE_LABELS } from '../../../utils/constants'
import { isRequired } from '../../../utils/validators'

const EMPTY_FORM = {
  name: '',
  type: UNIT_TYPES.STUDIO,
  location: '',
  floor: '',
  size_sqm: '',
  price: '',
  expected_roi: '',
  status: UNIT_STATUS.AVAILABLE,
  description: '',
  project_id: null,
}

export default function UnitForm({ initialValues, onSubmit, submitting }) {
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
      floor: isRequired(form.floor),
      size_sqm: isRequired(form.size_sqm),
      price: isRequired(form.price),
      expected_roi: isRequired(form.expected_roi),
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...form,
      floor:        Number(form.floor),
      size_sqm:     Number(form.size_sqm),
      price:        Number(form.price),
      expected_roi: Number(form.expected_roi),
      project_id:   form.project_id ?? null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <Input
        id="name"
        name="name"
        label="Unit name"
        placeholder="e.g. Unit A1"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        id="location"
        name="location"
        label="Location"
        placeholder="e.g. Panda Towers 001, Nairobi"
        value={form.location}
        onChange={handleChange}
        error={errors.location}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium text-brand-900">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {Object.entries(UNIT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

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
            {Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          id="floor"
          name="floor"
          type="number"
          label="Floor"
          value={form.floor}
          onChange={handleChange}
          error={errors.floor}
        />
        <Input
          id="size_sqm"
          name="size_sqm"
          type="number"
          label="Size (m²)"
          value={form.size_sqm}
          onChange={handleChange}
          error={errors.size_sqm}
        />
        <Input
          id="expected_roi"
          name="expected_roi"
          type="number"
          step="0.1"
          label="Expected ROI (%)"
          value={form.expected_roi}
          onChange={handleChange}
          error={errors.expected_roi}
        />
      </div>

      <Input
        id="price"
        name="price"
        type="number"
        label="Price (KES)"
        value={form.price}
        onChange={handleChange}
        error={errors.price}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-brand-900">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          Save unit
        </Button>
      </div>
    </form>
  )
}
