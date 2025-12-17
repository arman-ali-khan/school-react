import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the Virtual Assistant for the Board of Intermediate and Secondary Education, Dinajpur, Bangladesh. 
Your goal is to assist students, teachers, and guardians with information regarding the board.

Key Information to know:
- The board manages SSC and HSC exams for the Rangpur division.
- Official website is dinajpureducationboard.gov.bd.
- Location: Upashahar, Dinajpur.
- You can help with: Finding results (mock instructions), Registration process, Name correction fees (approximate), Contact numbers (use placeholders).
- If asked about specific live results (e.g., "What is my GPA?"), politely decline and say you don't have access to the private database, but guide them to the result portal.
- Keep answers concise, professional, and polite.
- You can answer in English or Bangla.

Disclaimer: You are a demo AI assistant created for this specific project.
`;

export const getGeminiResponse = async (message: string): Promise<string> => {
  // Use the API_KEY environment variable directly.
  if (!process.env.API_KEY) {
    console.error("API Key is missing. Please configure the environment variable API_KEY.");
    return "Configuration Error: API Key is missing. Please contact the system administrator.";
  }

  try {
    // Correctly initialize GoogleGenAI with a named parameter for the API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Use gemini-3-flash-preview for general text tasks as per coding guidelines.
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    // Access the .text property directly (not a method).
    return response.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently unable to connect to the assistant service. Please check your internet connection or try again later.";
  }
};