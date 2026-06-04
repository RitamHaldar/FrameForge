import amqplib from "amqplib";
import { config } from "./config.js";

const QUEUE_NAME = "AUTH_NOTIFICATION_QUEUE";

const connection = await amqplib.connect(config.cloudAmqpUrl);

const channel = await connection.createChannel();

channel.assertQueue(QUEUE_NAME, {
    durable: true
})

export default channel;
