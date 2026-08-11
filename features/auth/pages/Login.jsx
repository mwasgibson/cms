import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <div className="w-full max-w-sm">
      {<p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Hotel Name.
        </p>}
      <h1 className="font-display text-2xl font-semibold text-brand-900">Hotel Admin</h1>
      <p className="mb-8 text-sm text-brand-500">Sign in with your admin account.</p>
      <LoginForm />
    </div>
  )
}