export interface RoomUI {
    id: number
    name: string
    thumbnail: string
    currentVideo: string
    viewers: number
    isMember: boolean
    duration: string
    creator: string
    description: string
    createdAt: string
    memberIds: number[]
    playlist: { title: string; thumbnail: string }[]
    tags: string[]
  }
  
  