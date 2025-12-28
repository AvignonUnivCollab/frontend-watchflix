
  export interface RoomUI {
    id: number
    name: string
    thumbnail: string
    currentVideo: string
    viewers: number
    creator: string
    description: string
    createdAt: string
    memberIds: number[]
    isMember: boolean
  }
  
  
  export interface CreateRoomRequest {
    name: string
    thumbnail: File | null
    description: string
    creatorId: number
  }
  