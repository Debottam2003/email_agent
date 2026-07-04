import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import { log } from "console";

dotenv.config();

const app = express();

const set = new Set();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

async function getEmails(req, res) {

    try {
        const { data } = await gmail.users.messages.list({
            userId: "me",
            maxResults: 30,
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
            maxResults: 30,
        });

        const messageIds = data.messages || [];
        let emailsArr = [];
        for (const message of messageIds) {
            console.log(message)
            if (!set.has(message.id)) {
                set.add(message.id);
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                    format: "metadata",
                    metadataHeaders: ["From", "Subject", "Date"],
                });
                if(email.data.labelIds[0]!="SENT"){
                   emailsArr.push(email.data);
                }
            } else {
                console.log(`Message ID ${message.id} already fetched`);
            }
        }
        console.log("Emails fetched");
        fs.writeFileSync("./emails.json", JSON.stringify(emailsArr), 'utf-8');
    } catch (error) {
        console.error(error.message);
    }
}

// Step 1: Login
app.get("/login", (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.readonly"
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
}, 1000 * 60 * 60);
    
app.listen(3333, () => {
    console.log("Running on http://localhost:3333");
});