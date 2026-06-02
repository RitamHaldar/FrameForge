import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const ProjectModel = mongoose.model("Projects", projectSchema);