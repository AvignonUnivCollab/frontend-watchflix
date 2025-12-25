import { API_BASE_URL } from "../config/api"
import { Room, CreateRoomRequest } from "../models/room"

export const roomApi = {
  // -----------------------
  // GET ALL ROOMS
  // -----------------------
  getAll: async (): Promise<Room[]> => {
    const res = await fetch(`${API_BASE_URL}/rooms`)
    if (!res.ok) throw new Error(res.toString())
    return res.json()
  },

  // -----------------------
  // GET ROOM BY ID
  // -----------------------
  getById: async (id: number): Promise<Room> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`)
    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  // -----------------------
  // CREATE ROOM
  // -----------------------
  create: async (data: CreateRoomRequest): Promise<Room> => {
    const formData = new FormData()

    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        description: data.description,
        creatorId: data.creatorId,
      })
    )

    if (!data.thumbnail) {
      throw new Error("Image obligatoire")
    }

    formData.append("image", data.thumbnail)

    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // -----------------------
  // UPDATE ROOM
  // -----------------------
  update: async (id: number, data: Partial<Room>): Promise<Room> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  // -----------------------
  // DELETE ROOM
  // -----------------------
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) throw new Error(res.status.toString())
  },

  // -----------------------
  // JOIN ROOM ✅
  // -----------------------
  join: async (roomId: number, userId: number): Promise<string> => {
    const res = await fetch(
      `${API_BASE_URL}/rooms/join?roomId=${roomId}&userId=${userId}`,
      { method: "POST" }
    )

    if (!res.ok) throw new Error(await res.text())
    return res.text()
  },

  // -----------------------
  // LEAVE ROOM ✅
  // -----------------------
  leave: async (roomId: number, userId: number): Promise<string> => {
    const res = await fetch(
      `${API_BASE_URL}/rooms/leave?roomId=${roomId}&userId=${userId}`,
      { method: "POST" }
    )

    if (!res.ok) throw new Error(await res.text())
    return res.text()
  },
}
