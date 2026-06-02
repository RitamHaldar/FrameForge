import "dotenv/config";

export const config = {
    RedisUrl: process.env.REDIS_URL || "",
    DbUrl: process.env.SANDBOX || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
}