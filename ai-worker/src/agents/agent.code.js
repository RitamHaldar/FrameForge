import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { listFilesTool, readFilesTool, updateFilesTool } from "./tools.js";
import { config } from "../config/config.js";
import { sysyemPrompt, optimizePromt } from "./systemPromt.js";

// Groq Model (Medium - id: 1) — Qwen 3.8: 500+ tokens/sec, top tier React/Vite code accuracy
export const modelGroq = new ChatGroq({
  model: "qwen/qwen3.8-27b",
  apiKey: config.GROQKEY,
  temperature: 0.1,
  maxTokens: 4096,
  streaming: true,
});

// NVIDIA Model (Pro - id: 2) — DeepSeek Flash on NVIDIA NIM endpoint: thinking turned off for maximum speed
export const modelNvidia = new ChatOpenAI({
  model: "deepseek-ai/deepseek-v4-flash-0731",
  apiKey: config.NVDIAKEY,
  temperature: 0.1,
  top_p: 0.95,
  maxTokens: 4096,
  streaming: true,
  modelKwargs: {
    enable_thinking: false,
    chat_template_kwargs: {
      enable_thinking: false,
    },
  },
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  }
});


// Mistral Codestral Model (Fast - id: 3) — Purpose-built 22B coding intelligence model
export const modelMistral = new ChatMistralAI({
  model: "codestral-latest",
  apiKey: config.MISTRALKEY,
  temperature: 0.1,
  maxTokens: 4096,
  streaming: true,
});

// Agent 1: Groq (Medium - Ultra Fast & High Accuracy)
export const agent1 = (createAgent({
  model: modelGroq,
  tools: [listFilesTool, readFilesTool, updateFilesTool],
  systemPrompt: sysyemPrompt
})).withConfig({
  recursionLimit: 25
});

// Agent 2: NVIDIA DeepSeek (Pro - Deep Multi-file Reasoning)
export const agent2 = (createAgent({
  model: modelNvidia,
  tools: [listFilesTool, readFilesTool, updateFilesTool],
  systemPrompt: sysyemPrompt
})).withConfig({
  recursionLimit: 25
});

// Agent 3: Mistral Codestral (Fast - Rapid Code Execution)
export const agent3 = (createAgent({
  model: modelMistral,
  tools: [listFilesTool, readFilesTool, updateFilesTool],
  systemPrompt: sysyemPrompt
})).withConfig({
  recursionLimit: 25
});

// Code Optimization Agent (Instant Sub-second Refactoring)
export const optimizeAgent = (createAgent({
  model: modelGroq,
  systemPrompt: optimizePromt
}));
