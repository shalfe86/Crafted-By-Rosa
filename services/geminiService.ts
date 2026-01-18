import { GoogleGenAI, Type } from "@google/genai";
import { DesignIdea } from "../types";

/**
 * Generates a creative craft idea based on user input using Gemini Flash.
 */
export const generateCraftConcept = async (userPrompt: string, style: string): Promise<DesignIdea> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a creative artisanal craft expert specializing in Macrame and Bleach Painting on clothing.
    Your goal is to suggest a unique, avant-garde project idea based on the user's vague request.
    The output must be structured JSON.
  `;

  const prompt = `
    User Request: "${userPrompt}"
    Preferred Style: "${style}"
    
    Generate a unique project idea. 
    The 'visualPrompt' field should be a highly descriptive image generation prompt to visualize this object, mentioning lighting, texture, and materials.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          materials: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Expert"] },
          visualPrompt: { type: Type.STRING }
        },
        required: ["title", "description", "materials", "difficulty", "visualPrompt"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No idea generated");
  
  return JSON.parse(text) as DesignIdea;
};

/**
 * Generates an image visualization of the craft idea using Gemini Pro Image.
 */
export const generateConceptImage = async (visualPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Using the high quality image preview model
  const model = "gemini-3-pro-image-preview";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: visualPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback if image generation fails or is blocked
    return "https://picsum.photos/1024/1024?grayscale&blur=2"; 
  }
};