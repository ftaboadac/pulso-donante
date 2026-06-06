import "server-only";

import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | null = null;

export const anthropicModel = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey,
      maxRetries: 0,
      timeout: 15_000,
    });
  }

  return anthropic;
}
