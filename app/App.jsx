import { AuthProvider } from '../features/auth/context/AuthContext'
import { ToastProvider } from '../components/ToastProvider'
import ErrorBoundary from '../components/ErrorBoundary'
import AppRoutes from './routes'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
