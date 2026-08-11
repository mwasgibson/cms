import { http } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

/**
 * Hotel API contract (Express, not Laravel):
 *   GET    /rooms                -> Room[]
 *   GET    /rooms/:room_number   -> Room
 *   POST   /rooms                -> Room   (admin only)
 *   PUT    /rooms/:room_number   -> Room   (admin only)
 *   DELETE /rooms/:room_number   -> { message }  (hard delete, admin only)
 *
 * Room shape:
 *   { id, room_number, room_type, price, capacity, status, description }
 *   room_type: 'Standard'|'Single'|'Double'|'Suite'|'Deluxe'|'Executive'
 *   status: 'available'|'reserved'|'occupied'|'cleaning'|'maintenance'
 *
 * Note: rooms are identified by room_number (not a numeric id) in the URL,
 * and there is no soft-delete/restore for rooms — delete is permanent.
 *
 * Like Deals, Rooms always talks to the real Express API regardless of the
 * global VITE_USE_MOCKS flag — it's the other verified live integration.
 */

const unwrap = (res) => {
  const d = res.data
  return Array.isArray(d) ? d : (d?.data ?? d)
}

export const listRooms  = async (params) => unwrap(await http.get(API.ROOMS, { params }))
export const getRoom    = async (roomNumber) => unwrap(await http.get(API.ROOM(roomNumber)))

export const createRoom = async (payload) => {
  const result = unwrap(await http.post(API.ROOMS, payload))
  auditLog.record('create', 'rooms', result.room_number ?? payload.room_number, payload)
  return result
}
export const updateRoom = async (roomNumber, payload) => {
  const result = unwrap(await http.put(API.ROOM(roomNumber), payload))
  auditLog.record('update', 'rooms', roomNumber, payload)
  return result
}
export const deleteRoom = async (roomNumber) => {
  await http.delete(API.ROOM(roomNumber))
  auditLog.record('delete', 'rooms', roomNumber)
}