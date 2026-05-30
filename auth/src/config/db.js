import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDB() {
    try {
        await mongoose.connect(config.MongoUri).then(() => {
            console.log("Database connected");
        })
    } catch (error) {
        console.log(error);
    }
}