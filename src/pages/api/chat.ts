import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import businesses from '../../data/businesses.json';

// In a real deployed app, ensure GEMINI_API_KEY is set in Netlify Environment Variables
const API_KEY = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Config Error: API Key missing' }), { status: 500 });
  }

  try {
    const body = await request.json();
    const userMessage = body.message;

    // Create a lean context string to save tokens/latency
    const contextData = businesses.map(b => `- ${b.name} (${b.category}): ${b.description}. Ubicación: ${b.location || 'Centro'}. Rating: ${b.rating}⭐`).join('\n');

    const systemPrompt = `
      Actúa como Astra, la IA oficial del directorio "Mercadotez" en Teziutlán.
      Tu objetivo es ayudar a la gente a encontrar negocios locales.
      
      CONTEXTO DE NEGOCIOS:
      ${contextData}

      REGLAS:
      1. Sé breve, amable y futurista (estilo cyberpunk light).
      2. Si te preguntan por un servicio, recomienda 1-3 opciones del contexto.
      3. Si recomiendas un negocio, menciona su calificación si es alta.
      4. Si no encuentras nada, sugiere buscar en la categoría más cercana.
      5. Tus respuestas deben ser en texto plano o Markdown simple.
    `;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Entendido. Soy Astra, lista para conectar a Teziutlán." }],
            },
        ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Error procesando tu solicitud' }), { status: 500 });
  }
}
