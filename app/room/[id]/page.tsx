"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Users,
  Send,
  GripVertical,
  ArrowLeft,
  Heart,
  UserPlus,
  LogOut,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Bot,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock data pour les salons
const availableVideos = [
  {
    id: 1,
    title: "The Matrix",
    description:
      "Un programmeur découvre la vérité sur sa réalité et son rôle dans la guerre contre ses contrôleurs. Un film de science-fiction révolutionnaire qui change la perception de la réalité.",
    thumbnail: "/matrix-movie-poster.png",
    url: "https://www.youtube.com/embed/m8e-FF8MsqU",
    duration: "2:16:00",
  },
  {
    id: 2,
    title: "Inception",
    description:
      "Un voleur qui s'infiltre dans les rêves des autres pour voler leurs secrets se voit proposer une dernière mission : implanter une idée dans l'esprit d'un homme.",
    thumbnail: "/inception-inspired-poster.png",
    url: "https://www.youtube.com/embed/YoHD9XEInc0",
    duration: "2:28:00",
  },
  {
    id: 3,
    title: "Interstellar",
    description:
      "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace pour assurer la survie de l'humanité dans un futur lointain.",
    thumbnail: "/interstellar-inspired-poster.png",
    url: "https://www.youtube.com/embed/zSWdZVtXT7E",
    duration: "2:49:00",
  },
  {
    id: 4,
    title: "Blade Runner 2049",
    description:
      "Un jeune blade runner découvre un secret enfoui depuis longtemps qui pourrait plonger ce qui reste de la société dans le chaos.",
    thumbnail: "/blade-runner-2049-poster.png",
    url: "https://www.youtube.com/embed/gCcx85zbxz4",
    duration: "2:44:00",
  },
  {
    id: 5,
    title: "Arrival",
    description:
      "Une linguiste experte est recrutée par l'armée pour communiquer avec des extraterrestres qui sont arrivés sur Terre.",
    thumbnail: "/arrival-poster.png",
    url: "https://www.youtube.com/embed/tFMo3UJ4B4g",
    duration: "1:56:00",
  },
  {
    id: 6,
    title: "The Prestige",
    description:
      "Deux magiciens rivaux s'affrontent dans une quête obsessionnelle pour créer le meilleur tour de magie.",
    thumbnail: "/the-prestige-movie-poster.jpg",
    url: "https://www.youtube.com/embed/o4gHCmTQDVI",
    duration: "2:10:00",
  },
  {
    id: 7,
    title: "Shutter Island",
    description:
      "Un marshal enquête sur la disparition d'une meurtrière qui s'est échappée d'un hôpital psychiatrique pour criminels aliénés.",
    thumbnail: "/shutter-island-movie-poster.jpg",
    url: "https://www.youtube.com/embed/5iaYLCiq5RM",
    duration: "2:18:00",
  },
]

interface Message {
  id: number
  user: string
  text: string
  timestamp: string
  isBot?: boolean
}

interface VideoSyncState {
  videoId: number
  isPlaying: boolean
  currentTime: number
  timestamp: number
}

interface Participant {
  id: string
  name: string
  stream?: MediaStream
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const roomId = Number.parseInt(id)

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState(availableVideos.slice(0, 5))
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "Alice", text: "Bienvenue dans le salon !", timestamp: "20:15" },
    { id: 2, user: "Bob", text: "Salut tout le monde 👋", timestamp: "20:16" },
    { id: 3, user: "Charlie", text: "Super choix de films !", timestamp: "20:17" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isBotThinking, setIsBotThinking] = useState(false)

  const videoRef = useRef<HTMLIFrameElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const currentVideo = playlist[currentVideoIndex]

  const isInPlaylist = (videoId: number) => {
    return playlist.some((v) => v.id === videoId)
  }

  const toggleVideoInPlaylist = (video: (typeof availableVideos)[0]) => {
    if (isInPlaylist(video.id)) {
      setPlaylist(playlist.filter((v) => v.id !== video.id))
      if (currentVideoIndex >= playlist.length - 1) {
        setCurrentVideoIndex(Math.max(0, playlist.length - 2))
      }
    } else {
      setPlaylist([...playlist, video])
    }
  }

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index)
    setIsPlaying(true)
    // Added reset current time when changing video
    setCurrentTime(0)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        user: "Vous",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])

      // Check if message starts with @bot or mentions the bot
      const mentionsBot = newMessage.toLowerCase().startsWith("@bot") || newMessage.toLowerCase().includes("chatbot")

      const userMessage = newMessage
      setNewMessage("")

      if (mentionsBot) {
        setIsBotThinking(true)
        try {
          const response = await fetch("/api/chat-bot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: userMessage.replace("@bot", "").trim(),
              roomContext: `Salon: Soirée Cinéma, Vidéo actuelle: ${currentVideo.title}, ${playlist.length} vidéos dans la playlist`,
            }),
          })

          const data = await response.json()

          const botMessage: Message = {
            id: messages.length + 2,
            user: "Bot Assistant",
            text: data.text,
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            isBot: true,
          }
          setMessages((prev) => [...prev, botMessage])
        } catch (error) {
          console.error("[v0] Error calling chatbot:", error)
          const errorMessage: Message = {
            id: messages.length + 2,
            user: "Bot Assistant",
            text: "Désolé, je ne peux pas répondre pour le moment.",
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            isBot: true,
          }
          setMessages((prev) => [...prev, errorMessage])
        } finally {
          setIsBotThinking(false)
        }
      }
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newPlaylist = [...playlist]
    const draggedItem = newPlaylist[draggedIndex]
    newPlaylist.splice(draggedIndex, 1)
    newPlaylist.splice(index, 0, draggedItem)

    setPlaylist(newPlaylist)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleLeaveRoom = () => {
    router.push("/")
  }

  const handleInvite = () => {
    const roomUrl = window.location.href
    navigator.clipboard.writeText(roomUrl)
    alert("Lien du salon copié dans le presse-papiers!")
  }

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate adding participant (in production, use WebSocket/Supabase for signaling)
      const localParticipant: Participant = {
        id: "local",
        name: "Vous",
        stream,
      }

      // Broadcast to localStorage to simulate other users seeing you
      localStorage.setItem(
        `room_${roomId}_participant_local`,
        JSON.stringify({
          id: "local",
          name: "Vous",
          hasVideo: isVideoEnabled,
          hasAudio: isAudioEnabled,
        }),
      )
    } catch (error) {
      console.error("[v0] Error accessing media devices:", error)
      alert("Impossible d'accéder à la caméra/microphone. Vérifiez les permissions.")
    }
  }

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }
    localStorage.removeItem(`room_${roomId}_participant_local`)
  }

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      // Turn off video
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => track.stop())
      }
      setIsVideoEnabled(false)
    } else {
      // Turn on video
      setIsVideoEnabled(true)
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
    }
    setIsAudioEnabled(!isAudioEnabled)
  }

  useEffect(() => {
    if (isVideoEnabled || isAudioEnabled) {
      startLocalStream()
    } else {
      stopLocalStream()
    }

    return () => {
      stopLocalStream()
    }
  }, [isVideoEnabled, isAudioEnabled])

  useEffect(() => {
    // In production, use WebSocket or Supabase Realtime to get other participants
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith(`room_${roomId}_participant_`) && e.key !== `room_${roomId}_participant_local`) {
        // Simulate receiving participant info
        const participantData = e.newValue ? JSON.parse(e.newValue) : null
        if (participantData) {
          setParticipants((prev) => {
            const existing = prev.find((p) => p.id === participantData.id)
            if (!existing) {
              return [
                ...prev,
                {
                  id: participantData.id,
                  name: participantData.name,
                },
              ]
            }
            return prev
          })
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [roomId])

  // Added effect to broadcast video state changes to other users
  useEffect(() => {
    const syncState: VideoSyncState = {
      videoId: currentVideo.id,
      isPlaying,
      currentTime,
      timestamp: Date.now(),
    }

    // Broadcast to localStorage (simulates real-time sync)
    localStorage.setItem(`room_${roomId}_sync`, JSON.stringify(syncState))
  }, [currentVideo.id, isPlaying, currentTime, roomId])

  // Added effect to listen for sync changes from other users
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `room_${roomId}_sync` && e.newValue) {
        const syncState: VideoSyncState = JSON.parse(e.newValue)

        // Only sync if the change is recent (within 2 seconds)
        if (Date.now() - syncState.timestamp < 2000) {
          // Find the video in playlist
          const videoIndex = playlist.findIndex((v) => v.id === syncState.videoId)
          if (videoIndex !== -1 && videoIndex !== currentVideoIndex) {
            setCurrentVideoIndex(videoIndex)
          }

          // Sync play/pause state
          if (syncState.isPlaying !== isPlaying) {
            setIsPlaying(syncState.isPlaying)
          }

          // Sync current time
          setCurrentTime(syncState.currentTime)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [roomId, currentVideoIndex, isPlaying, playlist])

  // Added Simulate tracking current time for sync
  useEffect(() => {
    if (isPlaying) {
      syncIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [isPlaying])

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux salons
          </Button>
        </Link>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Soirée Cinéma 🎬</h1>
            <p className="text-muted-foreground">Par Alice</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary text-white px-4 py-2 text-lg">
              <Users className="mr-2 h-4 w-4 text-white" />8 spectateurs
            </Badge>
            <Button onClick={handleInvite} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Inviter
            </Button>
            <Button onClick={handleLeaveRoom} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Quitter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Video player and playlist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main video player */}
            <div className="overflow-hidden rounded-lg">
              <div className="relative aspect-video bg-black max-h-[400px] rounded-lg overflow-hidden">
                {isPlaying ? (
                  <iframe
                    ref={videoRef}
                    src={`${currentVideo.url}?autoplay=1&t=${Math.floor(currentTime)}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={currentVideo.thumbnail || "/placeholder.svg"}
                      alt={currentVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="lg"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-20 h-20"
                      onClick={handlePlay}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="py-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{currentVideo.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2">Durée: {currentVideo.duration}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{currentVideo.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {isPlaying ? (
                    <Button size="icon" variant="outline" onClick={handlePause}>
                      <Play className="h-5 w-5 rotate-90" />
                    </Button>
                  ) : null}
                  <Button
                    size="icon"
                    variant={isInPlaylist(currentVideo.id) ? "default" : "outline"}
                    onClick={() => toggleVideoInPlaylist(currentVideo)}
                  >
                    <Heart className={`h-5 w-5 ${isInPlaylist(currentVideo.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* WebRTC video call section */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Appel vidéo du salon</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant={isVideoEnabled ? "default" : "outline"} onClick={toggleVideo}>
                    {isVideoEnabled ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                    {isVideoEnabled ? "Caméra activée" : "Caméra désactivée"}
                  </Button>
                  <Button size="sm" variant={isAudioEnabled ? "default" : "outline"} onClick={toggleAudio}>
                    {isAudioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                    {isAudioEnabled ? "Micro activé" : "Micro désactivé"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Local video */}
                {(isVideoEnabled || isAudioEnabled) && (
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    {isVideoEnabled ? (
                      <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold">
                            V
                          </div>
                          <p className="text-sm font-medium">Vous</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      Vous {isAudioEnabled ? "🎤" : "🔇"}
                    </div>
                  </div>
                )}

                {/* Other participants (simulated) */}
                {participants.map((participant) => (
                  <div key={participant.id} className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold">
                          {participant.name[0]}
                        </div>
                        <p className="text-sm font-medium">{participant.name}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {participant.name}
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {!isVideoEnabled && !isAudioEnabled && participants.length === 0 && (
                  <div className="col-span-2 md:col-span-3 p-8 text-center text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Activez votre caméra ou microphone pour rejoindre l'appel vidéo</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Video playlist */}
            <div>
              <h3 className="text-xl font-bold mb-4">Vidéos disponibles ({availableVideos.length} vidéos)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableVideos.map((video, index) => (
                  <div key={video.id} className="relative">
                    <div
                      className={`cursor-pointer transition-all ${
                        playlist.findIndex((v) => v.id === video.id) === currentVideoIndex && isInPlaylist(video.id)
                          ? "ring-2 ring-primary rounded-lg"
                          : ""
                      }`}
                      onClick={() => {
                        if (isInPlaylist(video.id)) {
                          const playlistIndex = playlist.findIndex((v) => v.id === video.id)
                          handleVideoClick(playlistIndex)
                        }
                      }}
                    >
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full aspect-video object-cover"
                        />
                        {isInPlaylist(video.id) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="h-10 w-10 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-medium line-clamp-1">{video.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">{video.duration}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant={isInPlaylist(video.id) ? "default" : "outline"}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleVideoInPlaylist(video)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isInPlaylist(video.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Chat and playlist management */}
          <div className="space-y-6">
            {/* Chat */}
            <Card className="flex flex-col h-[400px]">
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Chat du salon</h3>
                  <Badge variant="outline" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    @bot pour l'assistant
                  </Badge>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`font-semibold text-sm ${message.isBot ? "text-primary flex items-center gap-1" : ""}`}
                        >
                          {message.isBot && <Bot className="h-3 w-3" />}
                          {message.user}
                        </span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className={`text-sm ${message.isBot ? "bg-muted p-2 rounded" : ""}`}>{message.text}</p>
                    </div>
                  ))}
                  {isBotThinking && (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm text-primary flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          Bot Assistant
                        </span>
                      </div>
                      <p className="text-sm bg-muted p-2 rounded animate-pulse">Réflexion en cours...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex gap-2 flex-shrink-0">
                <Input
                  placeholder="Écrivez un message... (@bot pour l'assistant)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isBotThinking}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isBotThinking}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Playlist management */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Playlist actuelle ({playlist.length})</h3>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {playlist.map((video, index) => (
                    <div
                      key={video.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 p-2 rounded border cursor-move hover:bg-accent ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.duration}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
