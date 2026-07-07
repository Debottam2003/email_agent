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
        content: `
You are an AI assistant that extracts actionable tasks from emails.

Your goal is to determine whether the email contains a real task that should be added to Google Tasks.

Create a task ONLY if the email requires the user to perform an action, including:
- Meeting or interview
- Appointment
- Deadline
- Bill or payment due
- Verification or authentication
- Document submission
- Travel or booking
- Order pickup or delivery requiring action
- Government, banking, educational, or workplace communication
- Any email requesting the user to do something before a specific time

DO NOT create tasks for:
- Promotions
- Marketing
- Advertisements
- Newsletters
- Social media notifications
- Spam
- Discounts or offers
- Generic updates
- Receipts requiring no action

If the email contains a task, return ONLY valid JSON in this format:

{
  "id": "${email.id}",
  "task": {
    "title": "Short actionable title",
    "notes": "Brief description of what needs to be done.",
    "due": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
}

Rules:
- "title" should be short (max 8 words).
- "notes" should summarize the action.
- If no due date or time is mentioned, omit the "due" field entirely.
- Convert all dates/times into ISO 8601 UTC format.
- Do not invent dates.
- Return ONLY JSON.
- If there is no actionable task, return:
null

Email:
ID: ${email.id}
Snippet: ${email.snippet}
Labels: ${JSON.stringify(email.labelIds)}
`,
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
