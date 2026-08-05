import { classifySongs } from "./services/llm";
import { data} from "../src/services/llm/utils"

async function test() {
    console.log(import.meta.env.VITE_DEEPSEEK_API_KEY,
            data)
            return
    try {
        const result = await classifySongs(
            "deepseek",
            import.meta.env.VITE_DEEPSEEK_API_KEY,
            data
        );

        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

test();