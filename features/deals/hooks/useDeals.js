import { useCallback, useEffect, useState } from 'react'
import {
  listAllDeals, getDeal,
  createDeal as createDealReq, updateDeal as updateDealReq,
  deleteDeal as deleteDealReq, restoreDeal as restoreDealReq,
} from '../services/dealService'

// ─── List hook ───────────────────────────────────────────────────────────────
export function useDeals() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tok, setTok] = useState(0)

  useEffect(() => {
    let cancelled = false
    listAllDeals()
      .then((d) => { if (!cancelled) setDeals(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tok])

  const refetch     = useCallback(() => { setLoading(true); setError(null); setTok((t) => t + 1) }, [])
  const createDeal  = useCallback(async (d) => { const r = await createDealReq(d); setDeals((prev) => [r, ...prev]); return r }, [])
  const updateDeal  = useCallback(async (id, d) => { const r = await updateDealReq(id, d); setDeals((prev) => prev.map((x) => String(x.id) === String(id) ? r : x)); return r }, [])
  const deleteDeal  = useCallback(async (id) => { await deleteDealReq(id); setDeals((prev) => prev.map((x) => String(x.id) === String(id) ? { ...x, active: 0 } : x)) }, [])
  const restoreDeal = useCallback(async (id) => { const r = await restoreDealReq(id); setDeals((prev) => prev.map((x) => String(x.id) === String(id) ? r : x)); return r }, [])

  return { deals, loading, error, refetch, createDeal, updateDeal, deleteDeal, restoreDeal }
}

// ─── Single-deal hook ─────────────────────────────────────────────────────────
export function useDeal(id) {
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getDeal(id)
      .then((d) => { if (!cancelled) setDeal(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  return { deal, loading, error }
}