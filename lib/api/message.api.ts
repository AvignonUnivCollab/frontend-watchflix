import { API_BASE_URL } from "@/lib/config/api"

export const messageApi = {
  sendMessage: async (data: {
    roomId: number
    userId: number
    content: string
  }) => {
    const params = new URLSearchParams({
      roomId: data.roomId.toString(),
      userId: data.userId.toString(),
      content: data.content,
    })

    const res = await fetch(`${API_BASE_URL}/messages?${params}`, {
      method: "POST",
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  },
}
