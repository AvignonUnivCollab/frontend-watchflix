"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo simple (sans Image) */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          🎬 <span>WatchFlix</span>
        </Link>

        {/* SI NON CONNECTÉ */}
        {!isLoggedIn && (
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:underline">
              Se connecter
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              S'inscrire
            </Link>
          </div>
        )}

        {/* SI CONNECTÉ */}
        {isLoggedIn && (
          <DropdownMenu>
            
            {/* Bouton principal */}
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition">
                Mon compte ▾
              </button>
            </DropdownMenuTrigger>

            {/* MENU DÉROULANT */}
            <DropdownMenuContent align="end" className="w-56 mt-2">

              <DropdownMenuItem asChild>
                <Link href="/account">Mon profil</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/account">Changer mot de passe</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("isLoggedIn")
                  window.location.href = "/"
                }}
                className="text-red-600 font-semibold"
              >
                Déconnexion
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>
        )}
      </nav>
    </header>
  )
}
