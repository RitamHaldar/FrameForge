import express from "express";
import { agent1, agent2, agent3 } from "../agents/agent.code.js";
import { CompletionCopilot } from "monacopilot";
import { config } from "../config/config.js";
const router = express.Router();
const copilot = new CompletionCopilot(config.MISTRALKEY, {
    provider: 'mistral',
    model: 'codestral',
});
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
});

router.post("/optimize-code", async (req, res) => {
    try {
        const { code, language, filename } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Missing code to optimize" });
        }
        const promt = `FILE CONTEXT:
                        - Filename: ${filename || 'index.js'}
                        - Language: ${language || 'javascript'}
                        ### CODE TO OPTIMIZE:
                        ${code}`
        const response = await agent3.invoke({
            messages: [{ role: "user", content: promt }]
        })
        let optimizedCode = response.messages[response.messages.length - 1].content || "";

        // Clean up markdown fences if model mistakenly includes them
        if (optimizedCode.startsWith("\`\`\`")) {
            const lines = optimizedCode.split("\n");
            lines.shift(); // remove opening ```
            if (lines.length > 0 && lines[lines.length - 1].trim().startsWith("\`\`\`")) {
                lines.pop(); // remove closing ```
            }
            optimizedCode = lines.join("\n");
        }

        res.status(200).json({
            optimizedCode,
            message: "Code optimized successfully",
            success: true
        });

    } catch (error) {
        console.error("Code optimization error:", error);
        res.status(500).json({ error: "Failed to optimize code" });
    }
});

router.post('/code-completion',async(req,res)=>{
  try {
        // Complete function parses request context data passed by the frontend automatically
        const completion = await copilot.complete({ body: req.body });
        res.json(completion);
    } catch (error) {
        console.error('Copilot Error:', error);
        res.status(500).json({ error: 'Failed to generate code completion inline.' });
    }
})

export default router