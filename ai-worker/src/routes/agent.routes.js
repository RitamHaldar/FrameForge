import express from "express";
import { agent1, agent2 } from "../agents/agent.code.js";
const router = express.Router();

router.post("/invoke", async (req, res) => {
    const { message, projectId, agentNo } = req.body
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    try {
        const agent = agentNo == 1 ? agent1 : agent2;

        const response = await agent.stream({
            messages: [{
                role: "user",
                content: message
            }],
        }, {
            context: {
                projectId: projectId,
            },
            streamMode: "custom"
        })
        for await (const chunk of response) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
        }
        res.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        } else {
            res.write(`\nError: ${error.message}\n`);
            res.end();
        }
    }
})

export default router