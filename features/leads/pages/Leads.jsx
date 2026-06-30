import { useFetch } from '../../../hooks/useFetch'
import { listLeads } from '../services/leadService'
import LeadTable from '../components/LeadTable'

export default function Leads() {
  const { data: leads, loading, error } = useFetch(listLeads)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Leads</h1>
        <p className="text-sm text-brand-500">
          Inquiries and site visit requests from the website.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">Couldn't load leads. Try refreshing.</p>
      )}

      <LeadTable leads={leads ?? []} loading={loading} />
    </div>
  )
}
