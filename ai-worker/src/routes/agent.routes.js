import express from "express";
import { agent } from "../agents/agent.code.js";
const router = express.Router();

router.post("/invoke", async (req, res) => {
    const { message, projectId } = req.body
    try {
        const response = await agent.invoke({
            messages: [{
                role: "user",
                content: message
            }],
        }, {
            context: {
                projectId: projectId
            }
        })
        res.status(200).json({ message: response, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

export default router