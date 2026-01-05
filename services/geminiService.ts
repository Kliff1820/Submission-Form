
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const getAi = () => {
    if(!API_KEY) return null;
    return new GoogleGenAI({ apiKey: API_KEY });
}

export const analyzeIssuePhoto = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getAi();
  if(!ai) return "Gemini API key not configured.";

  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: "Describe the issue shown in this photo for a property maintenance ticket. Be concise and specific. Start with what is broken or damaged."
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, textPart] }
    });
    
    return response.text ?? "Could not analyze the image.";
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "Error analyzing image. Please describe it manually.";
  }
};


export const summarizeMaintenanceNotes = async (notes: string[]): Promise<string> => {
  const ai = getAi();
  if(!ai) return "Gemini API key not configured.";
  
  if (notes.length === 0) {
    return "No maintenance notes available to summarize.";
  }

  const prompt = `Summarize the following maintenance notes from a short-term rental business into a brief report. Group similar issues if possible and highlight any recurring problems.

---
${notes.join('\n---\n')}
---
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });

    return response.text ?? "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing notes with Gemini:", error);
    return "Error generating summary.";
  }
};
