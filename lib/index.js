// Shared library — public API
export { createResource, withLatency, isMock, http } from './apiClient'
export { auditLog } from './auditLog'
export { uploadImage, uploadImages } from './imageUpload'
export { can, canAny, canAll, permissionsFor } from './permissions'
