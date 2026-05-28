import https from "https";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { listFilesTool, readFilesTool, updateFilesTool } from "./tools.js";
import { config } from "../config/config.js"
import { sysyemPrompt } from "./systemPromt.js";

const keepAliveAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 64,
  keepAliveMsecs: 60000,
});

const model = new ChatOpenAI({
  model: "minimaxai/minimax-m2.7",
  apiKey: config.NVDIAKEY,
  temperature: 0.1,
  streaming: true,
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
    httpAgent: keepAliveAgent,
    httpsAgent: keepAliveAgent,
  }
})

const model2 = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRALKEY,
  temperature: 0.1,
  streaming: true,
})

const model3 = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: config.GROQKEY,
  temperature: 0.1,
  streaming: true,
})

export const agent1 = (createAgent({
  model,
  tools: [listFilesTool, readFilesTool, updateFilesTool],
  systemPrompt: sysyemPrompt
})).withConfig({
  recursionLimit: 25
})

export const agent2 = (createAgent({
  model: model2,
  tools: [listFilesTool, readFilesTool, updateFilesTool],
  systemPrompt: sysyemPrompt
})).withConfig({
  recursionLimit: 25
})

export const agent3 = (createAgent({
  model: model3,
  systemPrompt: `You are an elite AI coding autocomplete engine. 
The user will provide a snippet of code containing a special <CURSOR> token marking their exact typing position. 
Your ONLY task is to predict the exact code that should replace the <CURSOR> token to seamlessly continue the code.

Rules:
1. Analyze the context before and after <CURSOR> to determine correct indentation, logic, and closing tags.
2. Output ONLY the code continuation. Do NOT output the code that comes before the cursor.
3. CRITICAL: If the code is already complete at the <CURSOR> position (e.g. the tag is properly closed), output NOTHING (an empty string). Do NOT force unnecessary additions.
4. Do NOT invent random logic, attributes, or event handlers (like onClick) unless the user has actively started typing them.
5. Keep it brief: provide only 1-3 lines of code maximum.
6. Do NOT wrap your response in markdown code blocks (e.g. \`\`\`javascript). Output raw text only.
7. Provide no explanations or introductory text. Just the code.`
}))
