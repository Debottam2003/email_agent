import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const data = fs.readFileSync("./emails.json", "utf-8");
const Emails = JSON.parse(data);
// console.log(Emails)

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  for (let email of Emails) {
    // console.log(email)
    try {
      const chatCompletion = await getGroqChatCompletion(email);
      // Print the completion returned by the LLM.
      console.log(
        chatCompletion.choices[0]?.message?.content.replaceAll("**", "") || "",
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

export async function getGroqChatCompletion(email) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Classify Non-promotional important tasks and return "id" and "subject" of the email like '{ID:"",SUB:"the snippet provided"}' ignore replying if detected spam ${email.id}.${email.snippet},${email.labelIds}`,
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
