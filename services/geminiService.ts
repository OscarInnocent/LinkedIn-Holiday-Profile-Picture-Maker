import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in process.env");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * @param imageBase64 The base64 string of the source image (without data:image/... prefix)
 * @param mimeType The mime type of the image
 * @param prompt The user's instruction
 * @returns The base64 string of the generated image
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getAiClient();

  try {
    // Gemini 2.5 Flash Image supports both generation and editing via generateContent
    // We pass the image and the text prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: `Edit this image: ${prompt}. Maintain the main subject but apply the requested changes. Output only the image.`,
          },
        ],
      },
      // No responseMimeType/Schema for nano banana models
    });

    // Iterate to find the image part in the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
