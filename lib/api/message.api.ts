import { API_BASE_URL } from "@/lib/config/api"

export interface MessageApiResponse {
  id: number
  userId: number
  content: string
  timestamp: string
}

export const messageApi = {
  sendMessage: async (
    roomId: number,
    userId: number,
    content: string
  ): Promise<MessageApiResponse> => {
    const res = await fetch(
      `${API_BASE_URL}/rooms/${roomId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          content,
        }),
      }
    )

    if (!res.ok) {
      throw new Error(await res.text())
    }

    return res.json()
  },
}
