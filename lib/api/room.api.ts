import { API_BASE_URL } from "../config/api"
import { Room, CreateRoomRequest } from "../models/room"

export const roomApi = {
  getAll: async (): Promise<Room[]> => {
    const res = await fetch(`${API_BASE_URL}/rooms/list`)
    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  getById: async (id: number): Promise<Room> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`)
    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  create: async (data: CreateRoomRequest): Promise<Room> => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("creatorId", data.creatorId.toString())
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail)

    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    })

    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  update: async (id: number, data: Partial<Room>): Promise<Room> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error(res.status.toString())
  },
}
