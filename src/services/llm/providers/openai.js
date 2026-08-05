import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt";

export async function classifySongs(apiKey, songs) {
    const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
    });

    const response = await client.chat.completions.create({
        model: "gpt-5-mini",
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

    return response.choices[0].message.content;
}