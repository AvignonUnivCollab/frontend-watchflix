"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation basique (invisible)
    if (!oldPassword || !newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) return

    // Envoyer les données plus tard
    console.log({
      oldPassword,
      newPassword,
    })

    // TODO: Redirection backend plus tard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 rounded-lg">
            <Image
              src="/logo.png"
              alt="WatchFlix Logo"
              width={40}
              height={40}
              className="h-25 w-25"
            />
          </div>
        </Link>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Modifier le mot de passe</h1>
          <p className="text-muted-foreground">
            Mettez à jour votre mot de passe de manière sécurisée
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="old">Ancien mot de passe</Label>
            <Input
              id="old"
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">Nouveau mot de passe</Label>
            <Input
              id="new"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmer le mot de passe</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!oldPassword || !newPassword || !confirmPassword}
            >
              Valider
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                Annuler
              </Button>
            </Link>
          </div>

        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  )
}
