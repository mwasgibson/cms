import { useCallback, useEffect, useState } from 'react'
import {
  listRooms, getRoom,
  createRoom as createRoomReq, updateRoom as updateRoomReq,
  deleteRoom as deleteRoomReq,
} from '../services/roomService'

// ─── List hook ───────────────────────────────────────────────────────────────
export function useRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tok, setTok] = useState(0)

  useEffect(() => {
    let cancelled = false
    listRooms()
      .then((d) => { if (!cancelled) setRooms(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tok])

  const refetch    = useCallback(() => { setLoading(true); setError(null); setTok((t) => t + 1) }, [])
  const createRoom = useCallback(async (r) => { const created = await createRoomReq(r); setRooms((prev) => [...prev, created]); return created }, [])
  const updateRoom = useCallback(async (roomNumber, r) => { const updated = await updateRoomReq(roomNumber, r); setRooms((prev) => prev.map((x) => String(x.room_number) === String(roomNumber) ? updated : x)); return updated }, [])
  const deleteRoom = useCallback(async (roomNumber) => { await deleteRoomReq(roomNumber); setRooms((prev) => prev.filter((x) => String(x.room_number) !== String(roomNumber))) }, [])

  return { rooms, loading, error, refetch, createRoom, updateRoom, deleteRoom }
}

// ─── Single-room hook ─────────────────────────────────────────────────────────
export function useRoom(roomNumber) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!roomNumber) return
    let cancelled = false
    getRoom(roomNumber)
      .then((r) => { if (!cancelled) setRoom(r) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [roomNumber])

  return { room, loading, error }
}