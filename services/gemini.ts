
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the Virtual Assistant for the Board of Intermediate and Secondary Education, Dinajpur, Bangladesh. 
Your goal is to assist students, teachers, and guardians with information regarding the board.
Guidelines:
- Official website: dinajpureducationboard.gov.bd.
- Location: Upashahar, Dinajpur.
- Be concise, professional, and helpful in both English and Bangla.
`;

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Configuration Error.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The assistant is temporarily unavailable.";
  }
};
