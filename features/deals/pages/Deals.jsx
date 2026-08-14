import { Link } from 'react-router-dom'
import Button from '../../../components/Button'
import { useDeals } from '../hooks/useDeals'
import DealsTable from '../components/DealsTable'
import { usePermission } from '../../../hooks/usePermission'
import { ROUTES } from '../../../utils/constants'

export default function Deals() {
  const { deals, loading, error } = useDeals()
  const perms = usePermission().for('deals')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Deals</h1>
          <p className="text-sm text-brand-500">{deals.length} deal{deals.length === 1 ? '' : 's'}</p>
        </div>
        {perms.canCreate && <Link to={ROUTES.DEAL_NEW}><Button variant="accent">+ Add deal</Button></Link>}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">Couldn't load deals. Try refreshing.</p>}
      <DealsTable deals={deals} loading={loading} />
    </div>
  )
}