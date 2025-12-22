"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { authApi } from "@/lib/api/auth.api"
import { authStorage } from "@/lib/storage/auth.storage"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authApi.login({ email, password })
      authStorage.save(response.user)
      router.push("/")
    } catch (err) {
      console.error("Login error:", err)
      setError("Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image src="/logo.png" alt="WatchFlix" width={40} height={40} className="object-contain" />
          <span className="text-2xl font-bold">WatchFlix</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
          <p className="text-muted-foreground">Connectez-vous pour rejoindre vos salons</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Pas encore de compte ? </span>
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Créer un compte
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  )
}
