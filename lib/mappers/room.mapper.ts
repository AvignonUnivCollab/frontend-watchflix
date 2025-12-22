import { Room } from "../models/room"
import { RoomUI } from "../models/room.ui"

export const mapRoomToUI = (room: Room): RoomUI => ({
  id: room.id ?? 0,
  name: room.name,
  thumbnail: room.thumbnail ?? "/placeholder.png",
  currentVideo: "Aucune vidéo",
  viewers: room.members ?? 0,
  duration: room.duration ? `${room.duration} min` : "—",
  creator: `User #${room.creatorId}`,
  description: room.description,
  createdAt: room.createdAt ?? "",
  playlist: [],
  tags: [],
})
