import OpenAI from "openai";

let openai: OpenAI | null = null;

export const openAIModel = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!openai) {
    openai = new OpenAI({ apiKey });
  }

  return openai;
}
