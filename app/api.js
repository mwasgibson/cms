/**
 * Re-exports the HTTP client from the central API abstraction layer.
 * Services that need raw axios access import from here.
 * Most services should use createResource() from lib/apiClient.js instead.
 */
export { http as default, createResource, withLatency, isMock } from '../lib/apiClient'
