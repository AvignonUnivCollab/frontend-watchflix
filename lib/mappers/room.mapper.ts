import { Room } from "../models/room"
import { RoomUI } from "../models/room.ui"
import { timeAgo } from "@/lib/utils/time"
import { API_BASE_URL } from "@/lib/config/api"

export const mapRoomToUI = (room: Room): RoomUI => {
  const thumbnail = `${API_BASE_URL}${room.thumbnail}`

  return {
    id: room.id ?? 0,
    name: room.name,
    thumbnail,
    currentVideo: "Aucune vidéo",
    viewers: room.members ?? 0,
    duration: room.duration ? `${room.duration} min` : "—",
    creator: `${room.creator}`,
    description: room.description,
    createdAt: room.createdAt ? timeAgo(room.createdAt) : "",
    playlist: [],
    tags: []
  }
}
