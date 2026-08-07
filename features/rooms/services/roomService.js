import { createResource } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'

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
 */

const roomsMock = {
  list: async () => [],
  get: async () => null,
  create: async (p) => ({ ...p }),
  update: async (id, p) => ({ ...p }),
  remove: async () => {},
}

const resource = createResource('rooms', roomsMock, {
  list:   () => API.ROOMS,
  get:    (roomNumber) => API.ROOM(roomNumber),
  create: () => API.ROOMS,
  update: (roomNumber) => API.ROOM(roomNumber),
  remove: (roomNumber) => API.ROOM(roomNumber),
})

export const listRooms  = (p) => resource.list(p)
export const getRoom    = (roomNumber) => resource.get(roomNumber)
export const createRoom = (d) => resource.create(d)
export const updateRoom = (roomNumber, d) => resource.update(roomNumber, d)
export const deleteRoom = (roomNumber) => resource.remove(roomNumber)