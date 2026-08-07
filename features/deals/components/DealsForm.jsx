import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { isRequired } from '../../../utils/validators'

const EMPTY_FORM = {
  title: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  promo_code: '',
  start_date: '',
  end_date: '',
  image_url: '',
}

export default function DealForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {
      title: isRequired(form.title),
      discount_value: isRequired(form.discount_value),
      start_date: isRequired(form.start_date),
      end_date: isRequired(form.end_date),
    }
    if (!next.start_date && !next.end_date && new Date(form.end_date) <= new Date(form.start_date)) {
      next.end_date = 'End date must be after the start date.'
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null || v === undefined)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...form,
      discount_value: Number(form.discount_value),
      promo_code: form.promo_code || null,
      description: form.description || null,
      image_url: form.image_url || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <Input
        id="title"
        name="title"
        label="Deal title"
        placeholder="e.g. Long Weekend Getaway"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="discount_type" className="text-sm font-medium text-brand-900">
            Discount type
          </label>
          <select
            id="discount_type"
            name="discount_type"
            value={form.discount_type}
            onChange={handleChange}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <Input
          id="discount_value"
          name="discount_value"
          type="number"
          min="0"
          step="0.01"
          label={form.discount_type === 'percentage' ? 'Discount (%)' : 'Discount amount'}
          value={form.discount_value}
          onChange={handleChange}
          error={errors.discount_value}
        />
      </div>

      <Input
        id="promo_code"
        name="promo_code"
        label="Promo code (optional)"
        placeholder="e.g. LONGWEEKEND"
        value={form.promo_code}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="start_date"
          name="start_date"
          type="date"
          label="Start date"
          value={form.start_date}
          onChange={handleChange}
          error={errors.start_date}
        />
        <Input
          id="end_date"
          name="end_date"
          type="date"
          label="End date"
          value={form.end_date}
          onChange={handleChange}
          error={errors.end_date}
        />
      </div>

      <Input
        id="image_url"
        name="image_url"
        label="Image URL (optional)"
        placeholder="https://..."
        value={form.image_url}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          Save deal
        </Button>
      </div>
    </form>
  )
}