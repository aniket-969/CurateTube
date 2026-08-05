import { classifySongs } from "./services/llm/index.js"
import { data} from "../src/services/llm/utils.js"

export async function test() {
    console.log(import.meta.env.VITE_DEEPSEEK_API_KEY,
            data)
            
    try {
        const result = await classifySongs(
            "deepseek",
            import.meta.env.VITE_DEEPSEEK_API_KEY,
            data
        );

        console.log("Got result",result);
    } catch (err) {
        console.error(err);
    }
}
