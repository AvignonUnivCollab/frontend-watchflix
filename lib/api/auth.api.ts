import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
  } from "../models/auth"
  import { API_BASE_URL } from "../config/api"

  
  
  export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
  
      if (!res.ok) throw new Error(res.status.toString())
      return res.json()
    },
  
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
  
      if (!res.ok) throw new Error(res.status.toString())
      return res.json()
    },
  }
  