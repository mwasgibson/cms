import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not sign in. Check your details and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
        value={form.password}
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={submitting} className="w-full">
        Sign in
      </Button>
    </form>
  )
}
