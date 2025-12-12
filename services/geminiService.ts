import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateAIContent = async (
  text: string, 
  action: AIActionType,
  context?: string
): Promise<string> => {
  if (!apiKey) {
    console.error("API Key missing");
    return "Error: API Key is missing. Please check configuration.";
  }

  if (!text && action !== 'GENERATE_SUMMARY') {
    return "";
  }

  let prompt = "";

  switch (action) {
    case 'FIX_SPELLING':
      prompt = `Correct the spelling and grammar of the following text. Do not add any introductory text, just provide the corrected text:\n\n"${text}"`;
      break;
    case 'ENHANCE_TONE':
      prompt = `Rewrite the following resume bullet point or description to be more professional, impactful, and action-oriented. Use strong verbs. Keep it concise. Return only the enhanced text:\n\n"${text}"`;
      break;
    case 'GENERATE_SUMMARY':
      prompt = `Generate a professional 2-3 sentence resume summary for a candidate with the following background details: ${context || text}. Focus on potential and enthusiasm. Return only the summary text.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original text on failure
  }
};
