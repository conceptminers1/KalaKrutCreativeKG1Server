import { GoogleGenAI } from "@google/genai";

export const generateEventDescription = async (artistName: string, genre: string, vibe: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key not found, returning mock data.");
    return "Experience an unforgettable night of music and connection. (AI Key Missing)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using the appropriate model for text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a catchy, 2-sentence event description for a music gig.
      Artist: ${artistName}
      Genre: ${genre}
      Vibe: ${vibe}
      Target Audience: Music enthusiasts and community members.`,
    });

    return response.text || "Join us for a spectacular evening of live performance.";
  } catch (error) {
    console.error("Error generating event description:", error);
    return "An electrifying event you won't want to miss.";
  }
};