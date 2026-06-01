import "dotenv/config";

export const config = {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleEmail: process.env.EMAIL_USER,
    cloudAmqpUrl: process.env.CLOUD_AMQP_URL
}