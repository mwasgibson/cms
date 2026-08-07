import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DealsForm from '../components/DealsForm'
import { createDeal } from '../services/dealService'
import { useToast } from '../../../hooks/useToast'
import { ROUTES } from '../../../utils/constants'

export default function AddDeal() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await createDeal(payload)
      showToast('Deal added', 'success')
      navigate(ROUTES.DEALS)
    } catch (err) {
      showToast(err.message || 'Could not save this deal. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link to={ROUTES.DEALS} className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to deals
      </Link>
      <h1 className="mt-2 mb-6 font-display text-2xl font-semibold text-brand-900">
        Add deal
      </h1>
      <DealsForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}