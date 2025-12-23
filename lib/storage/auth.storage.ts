import { User, AuthResponse } from "../models/auth"

const KEY = "watchflix_user"

export const authStorage = {
  save(user: AuthResponse) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(user))
    }
  },

  get(): AuthResponse | null {
    if (typeof window === "undefined") return null
  
    const data = localStorage.getItem(KEY)
    if (!data || data === "undefined") return null
  
    try {
      return JSON.parse(data)
    } catch {
      localStorage.removeItem(KEY)
      return null
    }
  }
  ,

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEY)
    }
  },
}
