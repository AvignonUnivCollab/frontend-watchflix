"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { API_BASE_URL } from "@/lib/config/api"
import { io, Socket } from "socket.io-client"

import {
  Play,
  Pause,
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
  User,
  Plus,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { roomApi } from "@/lib/api/room.api"
import { videoApi } from "@/lib/api/video.api"
import { authStorage } from "@/lib/storage/auth.storage"
import type {
  RoomDetail,
  VideoType,
  CreateVideoRequest,
} from "@/lib/models/room-detail"

import Image from "next/image"

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

interface Participant {
  id: string
  name: string
  stream?: MediaStream
}

interface PeerConnection {
  id: string
  connection: RTCPeerConnection
  stream?: MediaStream
}


export default function RoomPage() {
  const params = useParams()
  const router = useRouter()

  const roomId = params?.id as string

  const [room, setRoom] = useState<RoomDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<VideoType[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isBotThinking, setIsBotThinking] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const socketRef = useRef<Socket | null>(null)

  const [isCreateVideoOpen, setIsCreateVideoOpen] = useState(false)
  const [newVideo, setNewVideo] = useState({
    name: "",
    description: "",
    url: "",
    thumbnail: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCreatingVideo, setIsCreatingVideo] = useState(false)

  const videoRef = useRef<HTMLIFrameElement>(null)

  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [user, setUser] = useState<any | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const myPeerId = useRef(`peer-${Math.random().toString(36).substr(2, 9)}`)


  //recuperer l'utilisateur
  useEffect(() => {
    const storedUser = authStorage.get()
    setUser(storedUser)

  }, [])

  //connexion a socket IO
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
    })

    socketRef.current.emit("join-room", {
      roomId,
    })

    return () => {
      socketRef.current?.emit("leave-room", { roomId })
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [roomId])

  // listenner socketIO
  useEffect(() => {
    if (!socketRef.current) return
  
    const socket = socketRef.current
  
    const handleVideoAction = (action: any) => {
      const iframe = videoRef.current?.contentWindow
      if (!iframe) return
  
      switch (action.type) {
        case "play":
          iframe.postMessage(
            JSON.stringify({ event: "command", func: "playVideo" }),
            "*"
          )
          setIsPlaying(true)
          break
  
        case "pause":
          iframe.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo" }),
            "*"
          )
          setIsPlaying(false)
          break
      }
    }
  
    socket.on("video-action", handleVideoAction)
  
    return () => {
      socket.off("video-action", handleVideoAction)
    }
  }, []) // ✅ TOUJOURS un tableau vide
  
  
  



  useEffect(() => {
    if (!user) return

    const fetchRoom = async () => {

      try {
        setLoading(true)
        setError(null)
        const data = await roomApi.getDetail(Number(roomId), user.id)
        setRoom(data)

        // Set current video and playlist from API data
        console.log("fff" + data.currentVideo)
        if (data.currentVideo) {
          setCurrentVideo(data.currentVideo)
        } else if (data.videos.length > 0) {
          setCurrentVideo(data.videos[0])
        }

        setPlaylist(data.playlist || [])
        setMessages(data.messages || [])
      } catch (e) {
        console.error("[v0] Error fetching room:", e)
        setError("Impossible de charger le salon. Vérifiez votre connexion.")
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [roomId, router, user])

  useEffect(() => {
    const joinRoom = async () => {
      if (!user || !room) return

      try {
        await roomApi.join(Number(roomId), user.id)
      } catch (e) {
        console.error("Error joining room:", e)
      }
    }

    if (room) {
      joinRoom()
    }
  }, [roomId, room])

  const isInPlaylist = (videoId: number) => {
    return playlist.some((v) => v.id === videoId)
  }

  const toggleVideoInPlaylist = (video: VideoType) => {
    if (isInPlaylist(video.id)) {
      setPlaylist(playlist.filter((v) => v.id !== video.id))
    } else {
      setPlaylist([...playlist, video])
    }
  }

  const handleVideoClick = (video: VideoType) => {
    setCurrentVideo(video)
    setIsPlaying(true)
    setCurrentTime(0)
  }

  const handleTogglePlay = () => {
    if (!currentVideo) return
  
    socketRef.current?.emit("video-action", {
      roomId,
      action: {
        type: isPlaying ? "pause" : "play",
        videoId: currentVideo.id,
      },
    })
  }
  


  const getYoutubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&"'>]+)/)
    return match ? match[1] : null
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
              roomContext: `Salon: ${room?.name}, Vidéo actuelle: ${currentVideo?.title}, ${playlist.length} vidéos dans la playlist`,
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
          console.error("Error calling chatbot:", error)
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

  const handleLeaveRoom = async () => {

    try {
      if (user) {
        await roomApi.leave(Number(roomId), user.id)
      }
    } catch (e) {
      console.error("[v0] Error leaving room:", e)
    } finally {
      router.push("/")
    }
  }

  const handleInvite = () => {
    const roomUrl = window.location.href
    navigator.clipboard.writeText(roomUrl)
    alert("Lien du salon copié dans le presse-papiers!")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewVideo({ ...newVideo, thumbnail: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleCreateVideo = async () => {
    if (!newVideo.name || !newVideo.url || !newVideo.description) {
      //alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!user) {
      //alert("Vous devez être connecté")
      return
    }

    if (room?.videos.some(v => v.title === newVideo.name)) {
      alert("Une vidéo avec ce titre existe déjà dans ce salon")
      return
    }

    try {
      setIsCreatingVideo(true)

      console.log(user.id)
      const createdVideo = await videoApi.create({
        name: newVideo.name,
        description: newVideo.description,
        thumbnail: newVideo.thumbnail,
        url: newVideo.url,
        roomId: Number(roomId),
        creatorId: user.id,
      })

      setRoom(prev =>
        prev
          ? { ...prev, videos: [...prev.videos, createdVideo] }
          : prev
      )

      setNewVideo({ name: "", description: "", url: "", thumbnail: null })
      setImagePreview(null)
      setIsCreateVideoOpen(false)

    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsCreatingVideo(false)
    }
  }


  const handleCloseCreateVideo = () => {
    setNewVideo({ name: "", description: "", url: "", thumbnail: null })
    setImagePreview(null)
    setIsCreateVideoOpen(false)
  }

  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    const pc = new RTCPeerConnection(configuration)


    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream)
      })
    }

    pc.ontrack = (event) => {
      console.log("[v0] Received remote track from", peerId)
      const stream = event.streams[0]
      setRemoteStreams((prev) => {
        const newMap = new Map(prev)
        newMap.set(peerId, stream)
        return newMap
      })
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[v0] Sending ICE candidate to", peerId)
        const signaling = {
          type: "ice-candidate",
          from: myPeerId.current,
          to: peerId,
          candidate: event.candidate,
          roomId: roomId,
        }
        localStorage.setItem(`webrtc_signal_${Date.now()}`, JSON.stringify(signaling))
      }
    }

    pc.onconnectionstatechange = () => {
      console.log("[v0] Connection state with", peerId, ":", pc.connectionState)
    }

    return pc
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

      // Announce presence in room
      const announcement = {
        type: "join",
        peerId: myPeerId.current,
        roomId: roomId,
        name: "Utilisateur",
      }
      localStorage.setItem(`webrtc_signal_${Date.now()}`, JSON.stringify(announcement))

      console.log("Started local stream, announced presence:", myPeerId.current)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      alert("Impossible d'accéder à la caméra/microphone. Vérifiez les permissions.")
    }
  }

  const stopLocalStream = () => {
    // Close all peer connections
    peerConnections.forEach((pc) => pc.close())
    setPeerConnections(new Map())
    setRemoteStreams(new Map())

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }

    // Announce leaving
    const announcement = {
      type: "leave",
      peerId: myPeerId.current,
      roomId: roomId,
    }
    localStorage.setItem(`webrtc_signal_${Date.now()}`, JSON.stringify(announcement))

    console.log("Stopped local stream and left room")
  }

  const createOffer = async (peerId: string) => {
    const pc = createPeerConnection(peerId)
    setPeerConnections((prev) => new Map(prev).set(peerId, pc))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    const signaling = {
      type: "offer",
      from: myPeerId.current,
      to: peerId,
      offer: offer,
      roomId: roomId,
    }
    localStorage.setItem(`webrtc_signal_${Date.now()}`, JSON.stringify(signaling))
    console.log("Sent offer to", peerId)
  }

  const handleOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
    console.log("Received offer from", from)
    const pc = createPeerConnection(from)
    setPeerConnections((prev) => new Map(prev).set(from, pc))

    await pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    const signaling = {
      type: "answer",
      from: myPeerId.current,
      to: from,
      answer: answer,
      roomId: roomId,
    }
    localStorage.setItem(`webrtc_signal_${Date.now()}`, JSON.stringify(signaling))
    console.log("Sent answer to", from)
  }

  const handleAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
    console.log("Received answer from", from)
    const pc = peerConnections.get(from)
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }

  const handleIceCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
    console.log("Received ICE candidate from", from)
    const pc = peerConnections.get(from)
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  // Listen for signaling messages via localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("webrtc_signal_") && e.newValue) {
        const signal = JSON.parse(e.newValue)

        // Only process signals for this room
        if (signal.roomId !== roomId) return

        // Don't process own signals
        if (signal.from === myPeerId.current) return

        switch (signal.type) {
          case "join":
            if (signal.peerId !== myPeerId.current && localStream) {
              console.log("[v0] New peer joined:", signal.peerId)
              // Create offer to new peer
              createOffer(signal.peerId)
            }
            break
          case "offer":
            if (signal.to === myPeerId.current) {
              handleOffer(signal.from, signal.offer)
            }
            break
          case "answer":
            if (signal.to === myPeerId.current) {
              handleAnswer(signal.from, signal.answer)
            }
            break
          case "ice-candidate":
            if (signal.to === myPeerId.current) {
              handleIceCandidate(signal.from, signal.candidate)
            }
            break
          case "leave":
            console.log("[v0] Peer left:", signal.peerId)
            const pc = peerConnections.get(signal.peerId)
            if (pc) {
              pc.close()
              setPeerConnections((prev) => {
                const newMap = new Map(prev)
                newMap.delete(signal.peerId)
                return newMap
              })
              setRemoteStreams((prev) => {
                const newMap = new Map(prev)
                newMap.delete(signal.peerId)
                return newMap
              })
            }
            break
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [roomId, localStream, peerConnections])

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => track.stop())
      }
      setIsVideoEnabled(false)
    } else {
      setIsVideoEnabled(true)
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled
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

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key?.startsWith(`room_${roomId}_participant_`) && e.key !== `room_${roomId}_participant_local`) {
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

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [roomId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Chargement du salon...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Salon introuvable</h2>
          <p className="text-muted-foreground mb-4">Ce salon n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }
  const getYoutubeThumbnail = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/
    )

    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : "/placeholder.svg"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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
              <h1 className="text-3xl font-bold">{room.name}</h1>
              <p className="text-muted-foreground">Par {room.owner.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white px-4 py-2 text-lg">
                <Users className="mr-2 h-4 w-4 text-white" />
                {room.viewers} spectateurs
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
        </main>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentVideo ? (
              <div>
                <div className="relative">
                  <iframe
                    ref={videoRef}
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                      currentVideo.url
                    )}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                    className="pointer-events-none w-full max-h-[400px] aspect-video rounded-lg"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />

                  {/* Bouton custom par-dessus */}
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-black/70"
                    onClick={handleTogglePlay}
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{currentVideo.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-bold mb-2">Aucune vidéo sélectionnée</h3>
                <p className="text-muted-foreground">
                  {room.videos.length > 0
                    ? "Cliquez sur une vidéo ci-dessous pour commencer"
                    : "Ajoutez une vidéo pour commencer"}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Toutes les vidéos disponibles ({room.videos.length})</h3>
                <Button onClick={() => setIsCreateVideoOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une vidéo
                </Button>
              </div>

              {room.videos.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">Aucune vidéo dans ce salon</p>
                  <Button onClick={() => setIsCreateVideoOpen(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter la première vidéo
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {room.videos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <div className="relative cursor-pointer group" onClick={() => handleVideoClick(video)}>
                        <img
                          src={`${API_BASE_URL}${video.thumbnail}`}
                          alt={video.title}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <Button
                          size="sm"
                          variant={isInPlaylist(video.id) ? "default" : "secondary"}
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoInPlaylist(video)
                          }}
                        >
                          <Heart className={`h-4 w-4 ${isInPlaylist(video.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Video Conference */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Appel vidéo</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant={isVideoEnabled ? "default" : "secondary"} onClick={toggleVideo}>
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant={isAudioEnabled ? "default" : "secondary"} onClick={toggleAudio}>
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">Vous</span>
                </div>

                {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
                  <div key={peerId} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      autoPlay
                      playsInline
                      ref={(video) => {
                        if (video) video.srcObject = stream
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">Participant</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat Section */}
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
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun message</p>
                    <p className="text-xs mt-1">Soyez le premier à écrire!</p>
                  </div>
                ) : (
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
                )}
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
                <h3 className="font-bold">Vidéos favorites ({playlist.length})</h3>
              </div>
              {playlist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune vidéo favorite</p>
                  <p className="text-xs mt-1">Cliquez sur le cœur pour ajouter des vidéos</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {playlist.map((video, index) => (
                      <div
                        key={video.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-2 p-2 rounded border cursor-move hover:bg-accent ${draggedIndex === index ? "opacity-50" : ""
                          }`}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <img
                          src={getYoutubeThumbnail(video.url)}

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
              )}
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isCreateVideoOpen} onOpenChange={setIsCreateVideoOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="video-thumbnail">Image de couverture</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="video-thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-name">Nom de la vidéo *</Label>
              <Input
                id="video-name"
                placeholder="Ex: Ma vidéo préférée"
                value={newVideo.name}
                onChange={(e) => setNewVideo({ ...newVideo, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-url">URL de la vidéo *</Label>
              <Input
                id="video-url"
                placeholder="Ex: https://youtube.com/watch?v=..."
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description">Description *</Label>
              <Textarea
                id="video-description"
                placeholder="Décrivez votre vidéo..."
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseCreateVideo} disabled={isCreatingVideo}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateVideo}
              disabled={!newVideo.name || !newVideo.description || !newVideo.url || isCreatingVideo}
            >
              {isCreatingVideo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer la vidéo
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
