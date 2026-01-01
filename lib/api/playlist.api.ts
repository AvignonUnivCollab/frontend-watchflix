import { API_BASE_URL } from "@/lib/config/api"
import type { VideoType } from "@/lib/models/room-detail"

export const playlistApi = {
  // -----------------------
  // ADD VIDEO TO PLAYLIST
  // -----------------------
  addVideoToPlaylist: async (
    roomId: number,
    videoId: number,
    userId: number
  ): Promise<VideoType[]> => {
    const res = await fetch(
      `${API_BASE_URL}/rooms/${roomId}/playlist/add-video`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          userId,
        }),
      }
    )

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const playlist = await res.json()
    return playlist.videos ?? playlist
  },
}
