export interface User {
    id?: number
    nom: string
    prenom: string
    email: string
    role: string
  }
  
  export interface RegisterRequest {
    nom: string
    prenom: string
    email: string
    password: string
    role: string
  }
  
  export interface LoginRequest {
    email: string
    password: string
  }
  
  export type AuthResponse = {
    message: string
    email: string
    nom: string
    prenom: string
    role: string
  }
  