import Redis from "ioredis";
import { config } from "./config.js";
import { deletePod } from "../kubernetes/pod.js";
import { deleteService } from "../kubernetes/service.js";
const redis = new Redis(config.RedisUrl);
redis.on("connect", () => {
    console.log("Connected to Redis");
});
redis.on("error", (err) => {
    console.log("Error connecting to Redis: ", err);
});

const subscriber = new Redis(config.RedisUrl);

export async function createSandboxKey(sandboxId) {
    await redis.set(`sandbox-pod:${sandboxId}`, JSON.stringify({
        status: 'active'
    }), "EX", 60 * 23);
}

subscriber.config('SET', 'notify-keyspace-events', 'Ex');

subscriber.subscribe('__keyevent@0__:expired')

subscriber.on('message', async (channel, key) => {
    console.log(`Key expired: ${key}`);
    const sandboxId = key.split(':')[ 1 ];
    await deletePod(sandboxId);
    await deleteService(sandboxId);
})