const STORAGE_KEY = 'pt_audit_logs'
const MAX_LOCAL_ENTRIES = 200

// ─── LocalStorage store (mock mode) ─────────────────────────────────────────
function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOCAL_ENTRIES)))
}

// ─── Resolve current user from storage ───────────────────────────────────────
function currentUser() {
  try {
    const raw = localStorage.getItem('pt_mock_user')
    if (raw) {
      const u = JSON.parse(raw)
      return { id: u.id ?? 1, name: u.name ?? u.email ?? 'Admin' }
    }
  } catch { /* ignore */ }
  return { id: null, name: 'Unknown' }
}

// ─── Public API ──────────────────────────────────────────────────────────────
export const auditLog = {
  /**
   * Record an action in the audit log.
   * In mock mode this writes to localStorage.
   * In real mode the API layer (api.js interceptors) handles it server-side,
   * but we still keep a local copy for the UI.
   */
  record(action, resource, resourceId, meta = {}) {
    const entry = {
      id:          Date.now(),
      action,
      resource,
      resource_id: resourceId,
      user:        currentUser(),
      meta:        typeof meta === 'object' ? meta : {},
      timestamp:   new Date().toISOString(),
    }
    const logs = loadLogs()
    logs.push(entry)
    saveLogs(logs)
    return entry
  },

  /** Return all logs, newest first */
  all() {
    return [...loadLogs()].reverse()
  },

  /** Return logs for a specific resource type */
  forResource(resource) {
    return this.all().filter((l) => l.resource === resource)
  },

  /** Return logs for a specific record */
  forRecord(resource, id) {
    return this.all().filter(
      (l) => l.resource === resource && String(l.resource_id) === String(id),
    )
  },

  /** Return the most recent N entries */
  recent(n = 20) {
    return this.all().slice(0, n)
  },

  /** Clear all logs (dev/test use only) */
  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },
}
