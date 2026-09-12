import "dotenv/config";

export const config = {
    MISTRALKEY: process.env.MISTRAL_API_KEY || "",
    NVDIAKEY: process.env.NVIDIA_API_KEY || "",
    GROQKEY: process.env.GROQ_API_KEY || process.env.GROK_API_KEY || ""
};


