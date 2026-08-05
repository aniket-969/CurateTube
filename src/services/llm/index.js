import * as deepseek from "./providers/deepseek.js";
import * as gemini from "./providers/gemini.js";
import * as openai from "./providers/openai.js";

export async function classifySongs(provider, apiKey, songs) {
    switch (provider) {
        case "deepseek":
            return deepseek.classifySongs(apiKey, songs);

        case "gemini":
            return gemini.classifySongs(apiKey, songs);

        case "openai":
            return openai.classifySongs(apiKey, songs);

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}