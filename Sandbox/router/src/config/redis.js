import Redis from "ioredis";
import { config } from "./config.js";
const redis = new Redis(config.RedisUrl);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.log("Error connecting to Redis: ", err);
});

export async function refreshTTL(sandboxId,) {
  await redis.expire(`sandbox-pod:${sandboxId}`, 60 * 23);
}
export default redis;