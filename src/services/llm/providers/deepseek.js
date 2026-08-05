import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../utils.js";

export async function classifySongs(apiKey, songs) {
 try {
  console.log("Inside classify", songs, apiKey);

  console.time("API");

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
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
    }),
  });

  console.timeEnd("API");

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${errorText}`);
  }

  const response = await res.json();

  console.log(response.usage, "response usage");

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
