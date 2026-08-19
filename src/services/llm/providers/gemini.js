import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../../../utils/helper.js";

export async function classifySongs(apiKey, songs) {
  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: JSON.stringify(songs),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig: {
          thinkingLevel: "minimal",
        },
        maxOutputTokens: 65536,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response content received from Gemini.");
    }

    return parseLLMResponse(text);
  } catch (error) {
    console.error("Gemini Error:", error);

    error.source = "llm";

    throw error;
  }
}