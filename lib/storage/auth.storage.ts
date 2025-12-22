import { User } from "../models/auth"

const KEY = "watchflix_user"

export const authStorage = {
  save(user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(user))
    }
  },

  get(): User | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : null
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEY)
    }
  },
}
