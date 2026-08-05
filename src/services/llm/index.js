import * as deepseek from "./providers/deepseek";
import * as gemini from "./providers/gemini";
import * as openai from "./providers/openai";

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