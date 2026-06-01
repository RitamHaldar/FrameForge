import express from "express";
import morgan from "morgan";
import channel from "./config/queue.js"
import { sendMail } from "./services/mail.service.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/notification/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Notification Service is running"
    });
});


channel.consume("AUTH_NOTIFICATION_QUEUE", async (message) => {
    if (message) {
        const messageContent = message.content.toString()

        const { to, otp } = JSON.parse(messageContent);
        await sendMail({ to, otp });
        channel.ack(message);
    }
});

export default app;
