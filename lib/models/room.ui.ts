export interface RoomUI {
    id: number
    name: string
    thumbnail: string
    currentVideo: string
    viewers: number
    duration: string
    creator: string
    description: string
    createdAt: string
    playlist: { title: string; thumbnail: string }[]
    tags: string[]
  }
  