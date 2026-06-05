import { NextResponse } from "next/server";
import { z } from "zod";

import { getOpenAIClient, openAIModel } from "@/lib/openai";

export const runtime = "nodejs";

const summaryRequestSchema = z.object({
  text: z.string().min(10).max(12000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = summaryRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Send JSON with a `text` field between 10 and 12000 characters." },
      { status: 400 },
    );
  }

  try {
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: openAIModel,
      instructions:
        "Summarize the user's text for a hackathon team. Be concise, practical, and preserve decisions, blockers, and next actions.",
      input: parsed.data.text,
      max_output_tokens: 500,
    });

    return NextResponse.json({ summary: response.output_text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate summary.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
