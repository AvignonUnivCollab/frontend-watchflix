export interface UserLite {
    id: number
    name: string
  }
  
  export interface VideoType {
    id: number
    title: string
    description: string
    url: string
    thumbnail: string
    duration?: string | number
    position?: number
  }
  
  export interface MessageType {
    id: number
    user: string
    content: string
    timestamp: string
  }
  
  export interface RoomDetail {
    id: number
    name: string
    description: string
    thumbnail: string
    owner: UserLite
    viewers: number
    member: boolean
    currentVideo: VideoType | null
    videos: VideoType[]
    playlist: VideoType[]
    messages: MessageType[]
  }
  
  export interface CreateVideoRequest {
    name: string
    description: string
    url: string
    thumbnail: File | null
    roomId: number
  }
  

  
  