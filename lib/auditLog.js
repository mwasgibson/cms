const STORAGE_KEY = 'pt_audit_logs'

const readLogs = () => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const writeLogs = (logs) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('pt_user') || 'null')
  } catch {
    return null
  }
}

export const auditLog = {
  all: () => readLogs(),
  record: (action, resource, resource_id, payload) => {
    const logs = readLogs()
    logs.push({
      timestamp: new Date().toISOString(),
      user: getCurrentUser(),
      action,
      resource,
      resource_id,
      payload,
    })
    writeLogs(logs)
  },
}
