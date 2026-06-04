import amqplib from "amqplib";
import { config } from "./config.js"

const queue = await amqplib.connect(config.cloudAmqpUrl);

const channel = await queue.createChannel();

channel.assertQueue("AUTH_NOTIFICATION_QUEUE", {
    durable: true
})

export const sendOtpforVerification = async (message) => {
    await channel.sendToQueue("AUTH_NOTIFICATION_QUEUE", Buffer.from(JSON.stringify(message)),{ persistent: true });
}