import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import { log } from "console";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

const set = new Set();

const tasksID_Set = new Set();

let TASK_LIST_ID = "";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(email) {
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
- If there is no actionable task, ignore

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

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

const tasks = google.tasks({
    version: "v1",
    auth: oauth2Client,
});

async function getEmails(req, res) {

    try {
        const { data } = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
        });

        const messageIds = data.messages || [];
        let htmlContent = "";
        for (const message of messageIds) {
            htmlContent += `<p>Message ID: ${message.id}</p>`;
            const email = await gmail.users.messages.get({
                userId: "me",
                id: message.id,
                format: "metadata",
                metadataHeaders: ["From", "Subject", "Date"],
            });
            htmlContent += JSON.stringify(email);
            htmlContent += "<br><br><br>";
        }
        res.send(htmlContent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching emails");
    }

}

async function getEmailsPeriodically() {
    try {
        const { data } = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
        });

        const messageIds = data.messages || [];
        let emailsArr = [];
        for (const message of messageIds) {
            // console.log(message);
            if (!set.has(message.id)) {
                set.add(message.id);
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                    format: "metadata",
                    metadataHeaders: ["From", "Subject", "Date"],
                });
                if (email.data.labelIds[0] != "SENT") {
                    emailsArr.push(email.data);
                }
            } else {
                // console.log(`Message ID ${message.id} already fetched`);
            }
        }
        console.log("Emails fetched");
        fs.writeFileSync("./emails.json", JSON.stringify(emailsArr), 'utf-8');

        const taskArr = [];

        for (let email of emailsArr) {
            // console.log(email)
            try {
                const chatCompletion = await getGroqChatCompletion(email);
                // Print the completion returned by the LLM.

                let ch = chatCompletion.choices[0]?.message?.content.replaceAll("**", "") || "";
                console.log(ch);
                if (ch != "") {
                    try {
                        let task = JSON.parse(ch);
                        console.log(task);
                        taskArr.push(task);
                    } catch (err) {
                        console.log(err);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Add tasks
        console.log(taskArr);
        for (let task of taskArr) {
            addTask(task);
        }

    } catch (error) {
        console.error(error);
    }
}

// Add a task to Google Tasks List
async function addTask(task) {
    try {
        const res = await tasks.tasks.insert({
            tasklist: TASK_LIST_ID,
            requestBody: {
                title: task.task.title,
                notes: task.task.notes,
                due: task.task.due,
            }
        });
        // console.log(res.data);
    } catch (error) {
        console.error(error);
    }
}

// Step 1: Login
app.get("/login", (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/tasks"
            ]
        });

        res.redirect(url);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during login");
    }
});

// Step 2: Callback
app.get("/oauth2callback", async (req, res) => {
    try {
        const code = req.query.code;

        const { tokens } = await oauth2Client.getToken(code);

        // console.log(tokens);

        oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });

        fs.writeFileSync("tokens.json", JSON.stringify(tokens));


        res.send("Check your terminal. Save the refresh token.");

        try {
            const data = fs.readFileSync("tasks.json", "utf-8");
            console.log(data);
            if (!data) {
                // Create a new task list
                const list = await tasks.tasklists.insert({
                    requestBody: {
                        title: "My EMail Tasks"
                    }
                });
                console.log(list.data.id);
                TASK_LIST_ID = list.data.id;
                fs.writeFileSync("tasks.json", JSON.stringify({ taskListId: TASK_LIST_ID }));
            } else {
                console.log("tasks.json exists, reading taskListId from it.");
                const parsedData = JSON.parse(data);
                TASK_LIST_ID = parsedData.taskListId;
            }
        } catch (error) {
            console.error(error);
        }
        getEmailsPeriodically(); // initial call for fetching emails.
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during OAuth2 callback");
    }
});

app.get("/emails", getEmails);
setInterval(() => {
    getEmailsPeriodically();
}, 1000 * 60 * 60);// Fetch emails every hour

app.listen(3333, () => {
    console.log("Running on http://localhost:3333");
});