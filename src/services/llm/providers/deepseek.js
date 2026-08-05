import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../utils.js";

export async function classifySongs(apiKey, songs) {
    try {
        console.log("Inside classify", songs, apiKey);

        const client = new OpenAI({
            apiKey,
            baseURL: "https://api.deepseek.com",
            dangerouslyAllowBrowser: true,
        });

        const response = await client.chat.completions.create({
            model: "deepseek-v4-flash",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: JSON.stringify(songs),
                },
            ],
        });

        console.log("Raw response", response);

        const text = response.choices[0].message.content;

        console.log("Text response", text);

        return parseLLMResponse(text);

    } catch (err) {
        console.error("DeepSeek Error:", err);
        throw err;
    }
}