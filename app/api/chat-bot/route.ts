import { generateText } from "ai"

export async function POST(req: Request) {
  const { message, roomContext } = await req.json()

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Tu es un assistant chatbot dans un salon de visionnage vidéo collaboratif (WatchFlix). 
    
Contexte du salon: ${roomContext}

L'utilisateur demande: ${message}

Réponds de manière amicale et utile. Tu peux aider avec:
- Des informations sur les vidéos
- Des recommandations de films
- Des explications sur les fonctionnalités du salon
- Des réponses générales sur le cinéma

Garde tes réponses courtes et conversationnelles (2-3 phrases maximum).`,
    maxOutputTokens: 300,
  })

  return Response.json({ text })
}
