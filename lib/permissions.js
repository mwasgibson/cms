import { ROLES, PERMISSIONS } from '../utils/constants'

/**
 * Check if a user role has a specific permission.
 *
 * Usage:
 *   can('units.edit', user.role)  // → true | false
 */
export function can(permission, role = ROLES.VIEWER) {
  const rolePerms = PERMISSIONS[role] ?? []
  return rolePerms.includes(permission)
}

/**
 * Check if a role has any of the given permissions.
 */
export function canAny(permissions, role = ROLES.VIEWER) {
  return permissions.some((p) => can(p, role))
}

/**
 * Check if a role has all of the given permissions.
 */
export function canAll(permissions, role = ROLES.VIEWER) {
  return permissions.every((p) => can(p, role))
}

/**
 * Returns a map of common capability flags for a given role.
 * Handy for passing into components without prop-drilling individual checks.
 *
 * Usage:
 *   const perms = permissionsFor('units', user.role)
 *   perms.canEdit   // true | false
 *   perms.canDelete // true | false
 */
export function permissionsFor(feature, role) {
  return {
    canCreate: can(`${feature}.create`, role),
    canEdit:   can(`${feature}.edit`,   role),
    canDelete: can(`${feature}.delete`, role),
  }
}
