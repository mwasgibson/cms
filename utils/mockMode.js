/**
 * Mock mode utilities.
 * The decision is made once in lib/apiClient.js (VITE_USE_MOCKS env flag).
 * This file re-exports helpers so existing service files don't need to change.
 */
export { withLatency, isMock as shouldUseMocks } from '../lib/apiClient'
