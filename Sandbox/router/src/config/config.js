import "dotenv/config";

export const config = {
  RedisUrl: process.env.REDIS_URL || "",
};