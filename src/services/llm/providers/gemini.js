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
     
    },
  });

  const text = response.text;

  return parseLLMResponse(text);
}
