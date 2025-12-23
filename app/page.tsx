"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Clock, ChevronDown, List, Plus,  Video, Package } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { authApi } from "@/lib/api/auth.api"
import { authStorage } from "@/lib/storage/auth.storage"
import { roomApi } from "@/lib/api/room.api"
import { mapRoomToUI } from "@/lib/mappers/room.mapper"
import { RoomUI } from "@/lib/models/room.ui"

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
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [createRoomOpen, setCreateRoomOpen] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: "",
    thumbnail: null as File | null,
    description: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [rooms, setRooms] = useState<RoomUI[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [hasError, setHasError] = useState(false)


  useEffect(() => {
    const storedUser = authStorage.get()
    setUser(storedUser)

    if (!storedUser) {
      setAuthDialogOpen(true)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [])


  const loadRooms = async () => {
    setIsLoading(true)
    setHasError(false)
  
    try {
      // délai UX de 3 secondes
      await new Promise((resolve) => setTimeout(resolve, 3000))
  
      const fetchedRooms = await roomApi.getAll()
      console.log("Rooms loaded from API:", fetchedRooms)
  
      const uiRooms: RoomUI[] = fetchedRooms.map(mapRoomToUI)
      setRooms(uiRooms)
    } catch (error) {
      console.error("Erreur serveur :", error)
      setHasError(true)
      setRooms([]) 
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleCreateRoom = async () => {
    if (!newRoom.name || !newRoom.description || !newRoom.thumbnail || !user) {
      alert("Veuillez remplir tous les champs, image incluse")
      return
    }

    setIsLoading(true)
    try {
      const createdRoom = await roomApi.create({
        name: newRoom.name,
        description: newRoom.description,
        creatorId: user.id,
        thumbnail: newRoom.thumbnail,
      })
  
      console.log("Room created:", createdRoom)
  
      await loadRooms()
  
      setCreateRoomOpen(false)
      setNewRoom({ name: "", thumbnail: null, description: "" })
      setImagePreview(null)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la création du salon")
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleCloseCreateRoom = (open: boolean) => {
    setCreateRoomOpen(open)
    if (!open) {
      setNewRoom({
        name: "",
        thumbnail: null,
        description: "",
      })
      setImagePreview(null)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewRoom({ ...newRoom, thumbnail: file })

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Regardez ensemble, où que vous soyez</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Créez votre salon, invitez vos amis et profitez de vos vidéos préférées en temps réel avec chat et playlists
            collaboratives
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" className="text-lg"   onClick={() => {
              if (!user) {
                setAuthDialogOpen(true)
                return
              }
              setCreateRoomOpen(true)
            }}>
              <Plus className="mr-2 h-5 w-5" />
              Créer un salon
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Comment ça marche
            </Button>
          </div>
        </div>

        {/*AUCUN SALON */}
        {!hasError && !isLoading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>

            <h3 className="text-2xl font-semibold mb-2">
              Aucun salon pour le moment
            </h3>

            <p className="text-muted-foreground max-w-md mb-6">
              Il n’y a encore aucun salon disponible.
              Soyez le premier à en créer un et invitez vos amis !
            </p>
          </div>
        )}

        {/* Rooms Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Salons populaires</h2>
            {hasError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-destructive/10 p-6 rounded-full mb-6">
                  <Play className="h-10 w-10 text-destructive rotate-90" />
                </div>

                <h3 className="text-2xl font-semibold mb-2">
                  Erreur serveur
                </h3>

                <p className="text-muted-foreground max-w-md">
                  Impossible de charger les salons pour le moment.
                  Veuillez réessayer plus tard ou vérifier votre connexion.
                </p>
              </div>
            )}

          {!hasError && !isLoading && rooms.length >= 0 &&(
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {rooms.map((room) => (
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
                         {room.createdAt}
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
            )}
          
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
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
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Conference</h3>
            <p className="text-muted-foreground">Créez videoconferences dans un salon pour discuter avec les autres</p>
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

      <Dialog open={!!user && createRoomOpen} onOpenChange={(open) => user && setCreateRoomOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Créer un nouveau salon</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer votre salon de visionnage collaboratif
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Image de couverture</Label>
              <Input id="thumbnail" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom du salon *</Label>
              <Input
                id="name"
                placeholder="Ex: Soirée Cinéma 🎬"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre salon et ce que vous allez regarder..."
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateRoom} className="flex-1" disabled={!newRoom.name || !newRoom.description}>
                <Plus className="mr-2 h-4 w-4" />
                Créer le salon
              </Button>
              <Button variant="outline" onClick={() => handleCloseCreateRoom(false)} className="flex-1 bg-transparent">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Chargement des salons...</p>
          </div>
        </div>
      )}

    </div>
  )
}
