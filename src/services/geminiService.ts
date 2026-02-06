
import { GoogleGenAI } from "@google/genai";

export const generateEventDescription = async (artistName: string, genre: string, vibe: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("API Key not found, returning mock data.");
    return "Experience an unforgettable night of music and connection. (AI Key Missing)";
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `Write a catchy, 2-sentence event description for a music gig.
      Artist: ${artistName}
      Genre: ${genre}
      Vibe: ${vibe}
      Target Audience: Music enthusiasts and community members.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text || "Join us for a spectacular evening of live performance.";
  } catch (error) {
    console.error("Error generating event description:", error);
    return "An electrifying event you won't want to miss.";
  }
};
