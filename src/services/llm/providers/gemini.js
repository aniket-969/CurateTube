import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompt";
import { parseLLMResponse } from "../utils";

export async function classifySongs(apiKey, songs) {
    const ai = new GoogleGenAI({
        apiKey,
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: JSON.stringify(songs),
        config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0,
        },
    });
const text = response.text;
    return parseLLMResponse(text);
}