/*import { API_BASE_URL } from "@/lib/config/api"
export const videoApi = {
  /*create: async (data: {
    name: string
    url: string
    description: string,
    roomId: number
    userId: number
  }) => {
    const res = await fetch(`${API_BASE_URL}/videos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.name,
        description: data.description,
        url: data.url,       
        roomId: data.roomId,
        userId: data.userId,
        thumbnail: null,
        duration: 0,
      }),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  },


  create: async (data: {
    name: string,
    description: string,
    thumbnail : File | null,
    url: string,
    roomId: number,
    creatorId: number,
  }) => {
    const formData = new FormData()

    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        description: data.description,
        url: data.url,       
        roomId: data.roomId,
        creatorId: data.creatorId,
        duration: 0,
      })
    )

    if (!data.thumbnail) {
      throw new Error("Image obligatoire")
    }

    formData.append("image", data.thumbnail)

    const res = await fetch(`${API_BASE_URL}/videos`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

}
*/
import { API_BASE_URL } from "@/lib/config/api"

export const videoApi = {
  create: async (data: {
    name: string
    description: string
    thumbnail: File | null
    url: string
    roomId: number
    creatorId: number
  }) => {
    const formData = new FormData()

    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        description: data.description,
        url: data.url,
        roomId: data.roomId,
        creatorId: data.creatorId,
        duration: 0,
      })
    )

    if (!data.thumbnail) {
      throw new Error("Image obligatoire")
    }

    formData.append("image", data.thumbnail)

    const res = await fetch(`${API_BASE_URL}/videos`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  update: async (
    videoId: number,
    data: {
      title?: string
      description?: string
      url?: string
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  },
}
