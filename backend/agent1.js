import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
    try {
        const chatCompletion = await getGroqChatCompletion();
        // Print the completion returned by the LLM.
        console.log(chatCompletion.choices[0]?.message?.content.replaceAll("**", "") || "");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

export async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Explain system design in simple terms. under 100 words",
            },
        ],
        model: "openai/gpt-oss-20b",
    });
}

try {
    await main();
} catch (error) {
    console.error("Error:", error.message);
}