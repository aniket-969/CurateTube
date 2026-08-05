import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt";
import { parseLLMResponse } from "../utils";

export async function classifySongs(apiKey, songs) {
    const client = new OpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com",
        dangerouslyAllowBrowser: true,
    });

    const response = await client.chat.completions.create({
        model: "deepseek-chat",
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
    const text = response.choices[0].message.content;
    return parseLLMResponse(text);
    
}