import { API_BASE_URL } from "../config/api"
import { Room, CreateRoomRequest } from "../models/room"

export const roomApi = {
  getAll: async (): Promise<Room[]> => {
    const res = await fetch(`${API_BASE_URL}/rooms`)
    if (!res.ok) throw new Error(res.toString())
    return res.json()
  },

  getById: async (id: number): Promise<Room> => {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`)
    if (!res.ok) throw new Error(res.status.toString())
    return res.json()
  },

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
  
    if (!res.ok) {
      throw new Error(await res.text())
    }
  
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
