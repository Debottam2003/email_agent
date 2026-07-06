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
You are an email classifier.

Task:
Classify whether the following email is an IMPORTANT NON-PROMOTIONAL TASK.

Mark as IMPORTANT only if it requires the user to perform an action, such as:
- Meeting or interview
- Calendar event
- Deadline
- Payment or bill due
- Verification or authentication
- Order or booking confirmation
- Account/security alert
- Government, banking, workplace, or educational communication
- Appointment
- Document submission
- Travel itinerary
- Delivery requiring action

Ignore:
- Advertisements
- Marketing
- Promotions
- Newsletters
- Social notifications
- Spam
- Discounts
- Offers
- Generic updates
- Receipts that require no action

Return ONLY valid JSON.

If IMPORTANT:
{"id":"${email.id}","subject":"<short subject>"}

If NOT IMPORTANT:
ignore adding anything

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
