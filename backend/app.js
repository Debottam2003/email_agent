import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();

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
            maxResults: 3,
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
        fs.appendFileSync("./emails.txt", htmlContent, 'utf-8');

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
            maxResults: 3,
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
        fs.appendFileSync("./emails.txt", htmlContent, 'utf-8');

        res.send(htmlContent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching emails");
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
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during OAuth2 callback");
    }
});

app.get("/emails", getEmails);

setTimeout(() => {
    getEmailsPeriodically();
}, 1000 * 60);

app.listen(3333, () => {
    console.log("Running on http://localhost:3333");
});