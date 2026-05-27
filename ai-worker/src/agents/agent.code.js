import https from "https";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from "@langchain/mistralai"
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
