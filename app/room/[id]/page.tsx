"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation } from "@/components/navigation"

import { Play, Send, ArrowLeft, LogOut } from "lucide-react"
import { roomApi } from "@/lib/api/room.api"

const video = {
  title: "The Matrix",
  url: "https://www.youtube.com/embed/m8e-FF8MsqU",
}

interface Message {
  id: number
  user: string
  text: string
  timestamp: string
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params?.id as string

  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const videoRef = useRef<HTMLIFrameElement>(null)

  // --------------------
  // JOIN ROOM
  // --------------------
  useEffect(() => {
    const joinRoom = async () => {
      const user = JSON.parse(
        localStorage.getItem("watchflix_user") || "null"
      )
      if (!user) return

      try {
        await roomApi.join(Number(roomId), user.id)
        console.log("Salon rejoint")
      } catch (e) {
        console.error("Erreur join room", e)
      }
    }

    joinRoom()
  }, [roomId])

  // --------------------
  // LEAVE ROOM
  // --------------------
  const handleLeaveRoom = async () => {
    const user = JSON.parse(
      localStorage.getItem("watchflix_user") || "null"
    )

    try {
      if (user) {
        await roomApi.leave(Number(roomId), user.id)
        console.log("Salon quitté")
      }
    } catch (e) {
      console.error("Erreur leave room", e)
    } finally {
      router.push("/")
    }
  }

  // --------------------
  // CHAT (mock)
  // --------------------
  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: "Vous",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])

    setNewMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <Navigation />

        <main className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux salons
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Salon</h1>

            <Button onClick={handleLeaveRoom} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Quitter
            </Button>
          </div>
        </main>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-3 gap-6">
        {/* VIDEO */}
        <div className="col-span-2">
          {isPlaying ? (
            <iframe
              ref={videoRef}
              src={video.url + "?autoplay=1"}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          ) : (
            <Button onClick={() => setIsPlaying(true)}>
              <Play className="mr-2" />
              Play
            </Button>
          )}
        </div>

        {/* CHAT */}
        <Card className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 p-4">
            {messages.map((m) => (
              <div key={m.id}>
                <b>{m.user}</b> : {m.text}
              </div>
            ))}
          </ScrollArea>

          <div className="p-2 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
