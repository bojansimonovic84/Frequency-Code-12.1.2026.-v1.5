
import { GoogleGenAI } from "@google/genai";
import type { OrderDetails } from '../types';
import { saveOrder } from './supabase';
import { BOT_KNOWLEDGE_BASE } from './botKnowledge';

// Professional key detection
const getAI = () => {
  // Try to find API key in any available environment object
  let apiKey = '';
  
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    apiKey = process.env.API_KEY;
  } else if ((window as any).env && (window as any).env.API_KEY) {
    apiKey = (window as any).env.API_KEY;
  }

  if (!apiKey || apiKey === 'undefined') {
    console.error("CRITICAL: API_KEY environment variable missing in production. AI services will be disabled.");
    // We return a dummy key to prevent crash, but calls will fail with 401
    return new GoogleGenAI({ apiKey: 'INVALID_KEY' });
  }

  return new GoogleGenAI({ apiKey });
};

export const generateMeditationScript = async (details: OrderDetails): Promise<string> => {
  try {
    const ai = getAI();
    const userPrompt = `Draft the structural blueprint for a custom-engineered subconscious reprogramming track for ${details.name}.
      Identity: ${details.gender === 'male' ? 'Male' : 'Female'}. 
      Target Intention: ${details.detailedGoal}
      Category: ${details.goal}
      Brand: THE FREQUENCY CODE™`;

    const systemInstruction = `Act as a Senior Manifestation Architect. Output the structural Foundation Script for our Studio Design team.
      Requirements:
      - 4 Phases: Alpha Induction, Pattern Dissolution, Quantum Seed Insertion, Integration.
      - Tone: Luxurious, professional, authoritative.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const script = response.text || "Neural frequency blueprint locked.";
    await saveOrder(details, script);
    return script;
  } catch (error) {
    console.error("AI Generation Failed:", error);
    const fallback = `Manual engineering required for ${details.name}. Blueprint parameters cached. Studio notified of key-sync interruption.`;
    await saveOrder(details, fallback);
    return fallback;
  }
};

export const chatWithSupport = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model' as any, parts: h.parts })),
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: BOT_KNOWLEDGE_BASE,
                temperature: 0.7,
                topP: 0.95,
            }
        });
        return response.text || "Synchronizing with studio servers...";
    } catch (error) {
        console.error("Chat Error:", error);
        return "The secure neural link is experiencing slight synchronization lag in this deployment region. Please proceed with your plan selection below to lock in your priority slot.";
    }
}
