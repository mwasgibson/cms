import { useCallback, useEffect, useState } from 'react'
import {
  listDocuments,
  uploadDocument as uploadDocumentReq,
  deleteDocument as deleteDocumentReq,
} from '../services/documentService'

export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tok, setTok] = useState(0)

  useEffect(() => {
    let cancelled = false
    listDocuments()
      .then((d) => { if (!cancelled) setDocuments(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tok])

  const refetch = useCallback(() => { setLoading(true); setError(null); setTok((t) => t + 1) }, [])

  const uploadDocument = useCallback(async (payload) => {
    const created = await uploadDocumentReq(payload)
    setDocuments((prev) => [created, ...prev])
    return created
  }, [])

  const deleteDocument = useCallback(async (id) => {
    await deleteDocumentReq(id)
    setDocuments((prev) => prev.filter((d) => String(d.id) !== String(id)))
  }, [])

  return { documents, loading, error, refetch, uploadDocument, deleteDocument }
}