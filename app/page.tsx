"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Clock, ChevronDown, List } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

// Mock data pour les salons
const mockRooms = [
  {
    id: 1,
    name: "Soirée Cinéma 🎬",
    thumbnail: "/movie-night-cinema-screen.jpg",
    currentVideo: "The Matrix",
    viewers: 8,
    duration: "2:16:23",
    creator: "Alice",
    description: "Une soirée dédiée aux grands classiques du cinéma. Venez découvrir ou redécouvrir des films cultes !",
    createdAt: "Il y a 2 heures",
    playlist: [
      { title: "The Matrix", thumbnail: "/matrix-movie-poster.png" },
      { title: "Inception", thumbnail: "/inception-inspired-poster.png" },
      { title: "Interstellar", thumbnail: "/interstellar-inspired-poster.png" },
      { title: "Blade Runner 2049", thumbnail: "/blade-runner-2049-poster.png" },
      { title: "Arrival", thumbnail: "/arrival-poster.png" },
      { title: "The Prestige", thumbnail: "/the-prestige-movie-poster.jpg" },
      { title: "Shutter Island", thumbnail: "/shutter-island-movie-poster.jpg" },
    ],
    tags: ["Sci-Fi", "Action", "Classiques"],
  },
  {
    id: 2,
    name: "Musique Live 🎵",
    thumbnail: "/live-music-concert-stage.jpg",
    currentVideo: "Festival Playlist",
    viewers: 15,
    duration: "3:45:12",
    creator: "Bob",
    description: "Les meilleurs concerts et performances live. Une expérience musicale immersive !",
    createdAt: "Il y a 5 heures",
    playlist: [
      { title: "Festival Playlist", thumbnail: "/music-festival-concert-stage.png" },
      { title: "Rock Legends", thumbnail: "/rock-concert-electric-guitar.jpg" },
      { title: "Jazz Sessions", thumbnail: "/jazz-band-saxophone-performance.jpg" },
      { title: "Electronic Beats", thumbnail: "/electronic-music-dj-turntables.jpg" },
      { title: "Classical Masterpieces", thumbnail: "/orchestra-symphony-hall.jpg" },
      { title: "Indie Live Sessions", thumbnail: "/indie-band-acoustic-performance.jpg" },
    ],
    tags: ["Musique", "Live", "Concerts"],
  },
  {
    id: 3,
    name: "Gaming Marathon 🎮",
    thumbnail: "/esports-gaming-setup.png",
    currentVideo: "Speedrun Championship",
    viewers: 23,
    duration: "1:32:45",
    creator: "Charlie",
    description: "Marathon de gaming avec les meilleurs speedruns et compétitions e-sport.",
    createdAt: "Il y a 1 heure",
    playlist: [
      { title: "Speedrun Championship", thumbnail: "/speedrun-gaming-timer.jpg" },
      { title: "Pro League Finals", thumbnail: "/esports-tournament-stage.png" },
      { title: "Retro Gaming", thumbnail: "/retro-arcade-gaming-console.jpg" },
      { title: "Indie Showcase", thumbnail: "/indie-game-pixel-art.jpg" },
      { title: "World Tournament Highlights", thumbnail: "/gaming-trophy-championship.jpg" },
      { title: "Epic Gameplay Moments", thumbnail: "/gaming-controller-action.jpg" },
    ],
    tags: ["Gaming", "E-sport", "Compétition"],
  },
  {
    id: 4,
    name: "Documentaires Nature 🌍",
    thumbnail: "/nature-documentary-wildlife.jpg",
    currentVideo: "Planet Earth II",
    viewers: 12,
    duration: "0:58:30",
    creator: "Diana",
    description: "Explorez la beauté de notre planète avec des documentaires captivants sur la nature.",
    createdAt: "Il y a 3 heures",
    playlist: [
      { title: "Planet Earth II", thumbnail: "/planet-earth-mountains-wildlife.jpg" },
      { title: "Blue Planet", thumbnail: "/ocean-underwater-coral-reef.jpg" },
      { title: "Our Planet", thumbnail: "/nature-landscape-forest-animals.jpg" },
      { title: "Life", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Frozen Planet", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Seven Worlds One Planet", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "The Hunt", thumbnail: "/placeholder.svg?height=120&width=160" },
    ],
    tags: ["Nature", "Documentaire", "Environnement"],
  },
  {
    id: 5,
    name: "Anime Night 🌸",
    thumbnail: "/anime-japanese-animation.jpg",
    currentVideo: "Your Name",
    viewers: 19,
    duration: "1:46:15",
    creator: "Emma",
    description: "Soirée anime pour tous les fans ! Des classiques aux nouveautés.",
    createdAt: "Il y a 4 heures",
    playlist: [
      { title: "Your Name", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Spirited Away", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Demon Slayer", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Attack on Titan", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Weathering With You", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Jujutsu Kaisen", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "My Hero Academia", thumbnail: "/placeholder.svg?height=120&width=160" },
    ],
    tags: ["Anime", "Animation", "Japonais"],
  },
  {
    id: 6,
    name: "Comedy Central 😂",
    thumbnail: "/comedy-show-standup-stage.jpg",
    currentVideo: "Stand-up Special",
    viewers: 6,
    duration: "1:12:00",
    creator: "Frank",
    description: "Rires garantis avec les meilleurs stand-up et sketches comiques !",
    createdAt: "Il y a 30 minutes",
    playlist: [
      { title: "Stand-up Special", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Comedy Roast", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Improv Show", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Sitcom Best Of", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Sketch Comedy Classics", thumbnail: "/placeholder.svg?height=120&width=160" },
      { title: "Late Night Highlights", thumbnail: "/placeholder.svg?height=120&width=160" },
    ],
    tags: ["Comédie", "Stand-up", "Humour"],
  },
]

export default function HomePage() {
  const [selectedRoom, setSelectedRoom] = useState<(typeof mockRooms)[0] | null>(null)
  const [authDialogOpen, setAuthDialogOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Regardez ensemble, où que vous soyez</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Créez votre salon, invitez vos amis et profitez de vos vidéos préférées en temps réel avec chat et playlists
            collaboratives
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" variant="outline" className="text-lg bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Comment ça marche
            </Button>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Salons populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={room.thumbnail || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-primary text-white">
                    <Users className="mr-1 h-3 w-3 text-white" />
                    {room.viewers}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">En cours: {room.currentVideo}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {room.duration}
                    </div>
                    <div>Par {room.creator}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/room/${room.id}`} className="flex-1">
                      <Button className="w-full">Rejoindre</Button>
                    </Link>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Voir vidéos
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 bg-transparent"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Synchronisation parfaite</h3>
            <p className="text-muted-foreground">
              Regardez vos vidéos en temps réel, parfaitement synchronisées avec vos amis
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chat en direct</h3>
            <p className="text-muted-foreground">Commentez et partagez vos réactions instantanément avec le groupe</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Playlist collaborative</h3>
            <p className="text-muted-foreground">Créez ensemble la playlist parfaite pour votre soirée</p>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 WatchFlix MVP - Projet universitaire</p>
        </div>
      </footer>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Bienvenue !</DialogTitle>
            <DialogDescription className="text-center">
              Connectez-vous ou créez un compte pour rejoindre des salons et regarder des vidéos avec vos amis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Link href="/login" className="block">
              <Button className="w-full text-lg py-6">Se connecter</Button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Link href="/register" className="block">
              <Button variant="outline" className="w-full text-lg py-6 bg-transparent">
                Créer un compte
              </Button>
            </Link>

            <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setAuthDialogOpen(false)}>
              Continuer sans compte
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedRoom?.name}</DialogTitle>
            <DialogDescription>
              Créé par {selectedRoom?.creator} • {selectedRoom?.createdAt}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <img
                src={selectedRoom?.thumbnail || "/placeholder.svg"}
                alt={selectedRoom?.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{selectedRoom?.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Spectateurs</p>
                  <p className="font-semibold">{selectedRoom?.viewers}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-semibold">{selectedRoom?.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="font-semibold text-sm">{selectedRoom?.currentVideo}</p>
                </div>
              </div>
            </div>

            <div className="px-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <List className="h-4 w-4" />
                Aperçu de la playlist
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedRoom?.playlist.slice(0, 4).map((video, index) => (
                  <div key={index} className="flex flex-col">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full aspect-video object-cover rounded mb-2"
                    />
                    <span className="text-sm text-center line-clamp-2">{video.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedRoom?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Rejoindre le salon</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Voir la playlist complète
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
