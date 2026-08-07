import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { isRequired } from '../../../utils/validators'

const ROOM_TYPES = ['Standard', 'Single', 'Double', 'Suite', 'Deluxe', 'Executive']
const ROOM_STATUSES = ['available', 'reserved', 'occupied', 'cleaning', 'maintenance']

const EMPTY_FORM = {
  room_number: '',
  room_type: 'Standard',
  price: '',
  capacity: '',
  status: 'available',
  description: '',
}

export default function RoomForm({ initialValues, onSubmit, submitting, isEdit = false }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {
      room_number: isRequired(form.room_number),
      price: isRequired(form.price),
      capacity: isRequired(form.capacity),
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      description: form.description || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <Input
        id="room_number"
        name="room_number"
        label="Room number"
        placeholder="e.g. 101"
        value={form.room_number}
        onChange={handleChange}
        error={errors.room_number}
        disabled={isEdit}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="room_type" className="text-sm font-medium text-brand-900">
            Room type
          </label>
          <select
            id="room_type"
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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
            {ROOM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          label="Price / night"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
        />
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          label="Capacity"
          value={form.capacity}
          onChange={handleChange}
          error={errors.capacity}
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
          Save room
        </Button>
      </div>
    </form>
  )
}