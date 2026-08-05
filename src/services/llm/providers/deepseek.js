import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../utils.js";

export async function classifySongs(apiKey, songs) {
  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
      dangerouslyAllowBrowser: true,
    });

    console.time("API");

    const response = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      temperature: 0,
      thinking: {
        type: "disabled",
      },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(songs.slice(0, 10)),
        },
      ],
    });

    console.timeEnd("API");

    console.log(response.usage);

    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No response content received from DeepSeek.");
    }

    return parseLLMResponse(text);
  } catch (err) {
    console.error("DeepSeek Error:", err);
    throw err;
  }
}