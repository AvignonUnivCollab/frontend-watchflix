export interface Room {
    id?: number
    name: string
    thumbnail: string | null
    currentVideoId?: number | null
    members?: number
    duration?: number
    creatorId: number
    description: string
    createdAt?: string
  }
  
  export interface CreateRoomRequest {
    name: string
    thumbnail: File | null
    description: string
    creatorId: number
  }
  