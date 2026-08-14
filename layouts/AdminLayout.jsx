import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../features/auth/hooks/useAuth'
import Button from '../components/Button'

const NAV_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard' },
  { to: '/admin/rooms',      label: 'Rooms' },
  { to: '/admin/deals',      label: 'Deals' },
  { to: '/admin/documents',  label: 'Documents' },
  { to: '/admin/blog',       label: 'Blog' },
  { to: '/admin/content',    label: 'Content' },
  { to: '/admin/settings',   label: 'Settings' },
  { to: '/admin/audit-logs', label: 'Audit Logs' },
  { to: '/admin/trash',      label: 'Trash' },
]

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="border-b border-white/10 px-6 py-5">
        {/* TODO: swap in the hotel's actual name/branding here */}
        <p className="font-display text-lg font-semibold text-white">Hotel Admin</p>
        <p className="text-xs text-brand-100/60">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'text-brand-100/80 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/" /* TODO: point this at the live hotel site's URL */
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-100/80 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" />
          View live site
        </a>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentLabel =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))?.label ?? ''

  return (
    <div className="min-h-screen bg-brand-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col bg-brand-700 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-700/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-brand-700">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 text-brand-100/70 hover:text-white"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:min-w-0">
        <header className="flex items-center justify-between border-b border-brand-100 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-brand-500 hover:text-brand-900 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <span className="font-display text-sm font-semibold text-brand-900 lg:hidden">
              {currentLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-sm text-brand-500 sm:inline">
              {user?.fullname ?? user?.email}
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}