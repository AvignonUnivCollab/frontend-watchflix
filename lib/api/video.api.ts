import { API_BASE_URL } from "@/lib/config/api"
export const videoApi = {
  create: async (data: {
    name: string
    url: string
    roomId: number
    userId: number
  }) => {
    const res = await fetch(`${API_BASE_URL}/videos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.name,
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
}
