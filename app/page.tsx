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

       {/* Rooms detail section */}
    </div>
  )
}
