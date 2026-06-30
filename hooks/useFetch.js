import { useCallback, useEffect, useState } from 'react'

/**
 * Generic data-fetching hook for simple read flows. fetchFn should be a stable
 * function (e.g. a service's listX/getX) that returns a promise.
 *
 * For features with richer needs (filtering, optimistic CRUD updates), use a
 * dedicated hook instead — see useUnits/useProjects.
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchFn()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken, ...deps])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((t) => t + 1)
  }, [])

  return { data, loading, error, refetch, setData }
}
