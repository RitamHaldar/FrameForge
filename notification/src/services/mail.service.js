import { google } from "googleapis";
import { config } from "../config/config.js";
import { getOtpTemplate } from "../template/emailTemplate.js";
const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
);

oauth2Client.setCredentials({
    refresh_token: config.googleRefreshToken,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

export const sendMail = async ({to,otp}) => {
    try {
        const html = getOtpTemplate(otp);
        const message = [
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=utf-8",
            `From: "FrameForge" <${config.googleEmail || "me"}>`,
            `To: ${to}`,
            `Subject: FrameForge OTP Verification`,
            "",
            html,
        ].join("\r\n");
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });
       return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
