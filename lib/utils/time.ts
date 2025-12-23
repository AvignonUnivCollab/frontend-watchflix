export function timeAgo(dateString: string): string {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now.getTime() - past.getTime()
  
    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
  
    if (seconds < 60) return "créé à l’instant"
    if (minutes < 60) return `créé il y a ${minutes} minute${minutes > 1 ? "s" : ""}`
    if (hours < 24) return `créé il y a ${hours} heure${hours > 1 ? "s" : ""}`
    if (days < 7) return `créé il y a ${days} jour${days > 1 ? "s" : ""}`
    if (weeks < 4) return `créé il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`
    return `créé il y a ${months} mois`
  }
  