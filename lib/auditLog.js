let logs = []

const readLogs = () => {
  return [...logs]
}

const writeLogs = (newLogs) => {
  logs = [...newLogs]
}

export const auditLog = {
  all: () => {
    return readLogs()
  },

  record: (
    action,
    resource,
    resource_id,
    payload = null,
    user = null
  ) => {
    const currentLogs = readLogs()

    const newLog = {
      timestamp: new Date().toISOString(),
      user,
      action,
      resource,
      resource_id,
      payload,
    }

    writeLogs([
      ...currentLogs,
      newLog,
    ])

    return newLog
  },

  clear: () => {
    writeLogs([])
  },
}