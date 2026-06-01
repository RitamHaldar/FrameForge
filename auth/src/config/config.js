import "dotenv/config";

export const config = {
    MongoUri: process.env.MONGO_URL || "",
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    jwtSecret: process.env.JWT_SECRET || "",
    cloudAmqpUrl: process.env.CLOUD_AMQP_URL || ""
}