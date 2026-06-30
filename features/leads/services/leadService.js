import { createResource } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { leadsMock } from './mockLeads'

/**
 * Laravel API contract:
 *   GET    /leads       -> Lead[]
 *   GET    /leads/{id}  -> Lead
 *   POST   /leads       -> Lead   (also used by the public site's inquiry/site-visit form)
 *   PUT    /leads/{id}  -> Lead   (status changes, notes, site visit date)
 *   DELETE /leads/{id}  -> 204   (soft delete)
 *   PATCH  /leads/{id}/restore -> Lead
 *
 * Lead shape:
 *   { id, name, email, phone, message, unit_interest, source, status,
 *     site_visit_date, notes: [{text, created_at}], created_at, deleted_at }
 */

const resource = createResource('leads', leadsMock, {
  list:   () => API.LEADS,
  get:    (id) => API.LEAD(id),
  create: () => API.LEADS,
  update: (id) => API.LEAD(id),
  remove: (id) => API.LEAD(id),
})

export const listLeads   = (params) => resource.list(params)
export const getLead     = (id)     => resource.get(id)
export const createLead  = (data)   => resource.create(data)
export const updateLead  = (id, d)  => resource.update(id, d)
export const deleteLead  = (id)     => resource.remove(id)
export const restoreLead = (id)     => resource.restore(id)
