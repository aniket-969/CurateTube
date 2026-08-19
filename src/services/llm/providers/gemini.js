import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../../../utils/helper.js";

export async function classifySongs(apiKey, songs) {
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
  // console.log("Gemini usage:", response.usageMetadata);
  // console.log("Gemini finish reason:", response.candidates?.[0]?.finishReason);
  const text = response.text;
  // console.log("here is text",text)
  return parseLLMResponse(text);
}
