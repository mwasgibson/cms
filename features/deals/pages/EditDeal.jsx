import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import DealsForm from '../components/DealsForm'
import { useDeal } from '../hooks/useDeals'
import { updateDeal, deleteDeal, restoreDeal } from '../services/dealService'
import { useToast } from '../../../hooks/useToast'
import Button from '../../../components/Button'
import { usePermission } from '../../../hooks/usePermission'
import { ROUTES } from '../../../utils/constants'

export default function EditDeal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { deal, loading } = useDeal(id)
  const perms = usePermission().for('deals')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await updateDeal(id, payload)
      showToast('Deal updated', 'success')
      navigate(ROUTES.DEALS)
    } catch (err) {
      showToast(err.message || 'Could not save this deal. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async () => {
    try {
      await deleteDeal(id)
      showToast('Deal deactivated', 'success')
      navigate(ROUTES.DEALS)
    } catch (err) {
      showToast(err.message || 'Could not deactivate this deal.', 'error')
    }
  }

  const handleReactivate = async () => {
    try {
      await restoreDeal(id)
      showToast('Deal reactivated', 'success')
      navigate(ROUTES.DEALS)
    } catch (err) {
      showToast(err.message || 'Could not reactivate this deal.', 'error')
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-brand-500">Loading deal…</p>
  if (!deal) return <p className="py-10 text-center text-sm text-brand-500">Deal not found.</p>

  return (
    <div>
      <Link to={ROUTES.DEALS} className="text-sm text-brand-500 hover:text-brand-900">
        ← Back to deals
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Edit deal</h1>
        {perms.canDelete && (
          deal.active
            ? <Button variant="danger" onClick={handleDeactivate}>Deactivate</Button>
            : <Button variant="ghost" onClick={handleReactivate}>Reactivate</Button>
        )}
      </div>
      <DealsForm initialValues={deal} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}