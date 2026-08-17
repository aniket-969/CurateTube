import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { parseLLMResponse } from "../../../utils/helper.js";

export async function classifySongs(apiKey, songs) {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.chat.completions.create({
    model: "gpt-5.4-mini",
    reasoning_effort: "none",
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
