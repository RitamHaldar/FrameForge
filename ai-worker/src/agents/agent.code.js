import https from "https";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { listFilesTool, readFilesTool, updateFilesTool } from "./tools.js";
import { config } from "../config/config.js"
import { sysyemPrompt,optimizePromt } from "./systemPromt.js";



const model = new ChatOpenAI({
  model: "stepfun-ai/step-3.7-flash",
  apiKey: config.NVDIAKEY,
  temperature: 0.0,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  streaming: true,
  modelKwargs: {
    enable_thinking: false, // Turn off chain-of-thought to maximize raw generation speed
  },
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
    // Removed legacy httpAgent and httpsAgent to enable modern Node.js fetch with HTTP/2 and undici connection pooling
  }
});

const model2 = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRALKEY,
  temperature: 0.1,
  streaming: true,
})

export const model3 = new ChatGroq({
  model: "openai/gpt-oss-120b",
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
  systemPrompt: optimizePromt
}))

