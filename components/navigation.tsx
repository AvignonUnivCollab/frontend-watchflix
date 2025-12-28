"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { authStorage } from "@/lib/storage/auth.storage"

type UserSession = {
  id : number
  email: string
  nom: string
  prenom: string
  role: string
}

export function Navigation() {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    setUser(authStorage.get())
  }, [])

  const handleLogout = () => {
    authStorage.clear()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Image src="/logo.png" alt="WatchFlix Logo" width={40} height={40} className="rounded-lg" />
          WatchFlix
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium">
                Bonjour {user.prenom} {user.nom}
              </span>

              <Button variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link href="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
