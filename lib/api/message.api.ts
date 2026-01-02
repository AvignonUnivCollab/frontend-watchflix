import { API_BASE_URL } from "@/lib/config/api"

export const messageApi = {
  sendMessage: async (data: {
    roomId: number
    userId: number
    content: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: data.roomId,
        userId: data.userId,
        content: data.content,
      }),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  },
}
