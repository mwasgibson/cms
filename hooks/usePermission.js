import { useContext } from 'react'
import { AuthContext } from '../features/auth/context/auth-context'
import { can, canAny, canAll, permissionsFor } from '../lib/permissions'

/**
 * Hook that provides permission-checking utilities bound to the current user's role.
 *
 * Usage:
 *   const { can, for: perms } = usePermission()
 *   can('units.edit')           // true | false based on current user role
 *   perms('units').canCreate    // convenience flag object
 */
export function usePermission() {
  const ctx = useContext(AuthContext)
  const role = ctx?.user?.role ?? 'viewer'

  return {
    role,
    can:    (permission)   => can(permission, role),
    canAny: (permissions)  => canAny(permissions, role),
    canAll: (permissions)  => canAll(permissions, role),
    for:    (feature)      => permissionsFor(feature, role),
  }
}
