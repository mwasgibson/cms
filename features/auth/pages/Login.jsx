import LoginForm from '../components/LoginForm'
import { shouldUseMocks } from '../../../utils/mockMode'

export default function Login() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold text-brand-900">Panda Towers</h1>
      <p className="mb-8 text-sm text-brand-500">Sign in to manage the project.</p>
      {shouldUseMocks() && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Mock mode — any email + password gets you in. The backend isn't live yet.
        </p>
      )}
      <LoginForm />
    </div>
  )
}
