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
Only return code continuation. No explanations.

You will receive structured context including:
- File name and language
- Import statements from the file
- Previous code context (up to 200 lines before cursor)
- Code snippet with a <CURSOR> token marking the exact typing position

Rules:
1. Analyze ALL context — file name, language, imports, indentation, open/close tag pairs, variable scope, and surrounding logic — to determine the correct completion.
2. Output ONLY the code that replaces <CURSOR>. Never repeat code that already exists before or after the cursor position.
3. CRITICAL — DO NOT BREAK EXISTING CODE:
   - Never close a tag that is already closed after <CURSOR>.
   - Never open a tag that is already opened before <CURSOR> unless nesting is clearly intended.
   - Never redeclare variables, functions, or imports already present in the snippet.
   - Never add duplicate JSX attributes or HTML attributes to an element.
   - Ensure all brackets, parentheses, braces, and tags you introduce are properly balanced within your completion only — do not re-balance what already exists after <CURSOR>.
4. If the code is already syntactically complete at <CURSOR> (no open constructs, no missing tokens), output NOTHING. An empty response is correct and preferred over a forced addition.
5. Only introduce logic, attributes, props, or event handlers that are clearly implied or actively being typed in the existing context. Do NOT invent behavior.
6. Match the existing code style, indentation, and naming conventions visible in the context exactly.
7. Maximum 1–3 lines. Prefer the shortest correct completion.
8. Output raw code only. No markdown fences, no explanations, no comments, no introductory text.
9.Strictly Follow This :- Only return 1-5 words at max as response that fits exactly iwth the existing code.`
}))
