
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the Virtual Assistant for the Board of Intermediate and Secondary Education, Dinajpur, Bangladesh. 
Your goal is to assist students, teachers, and guardians with information regarding the board.
Key Information:
- SSC/HSC exams for Rangpur division.
- Official website: dinajpureducationboard.gov.bd.
- Location: Upashahar, Dinajpur.
- Professional, polite, English/Bangla answers.
`;

export const getGeminiResponse = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) return "Configuration Error: API Key is missing.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently unable to connect to the assistant service.";
  }
};
