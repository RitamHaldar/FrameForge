import mongoose from "mongoose";
import { config } from "./config.js";

export const db = mongoose.connect(config.DbUrl).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
});