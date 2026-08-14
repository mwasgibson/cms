import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen label="Checking your session…" />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
