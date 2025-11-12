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



export default function RoomPage() {
  

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
       
      </main>
    </div>
  )
}
