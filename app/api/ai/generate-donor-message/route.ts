import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

import { buildMessageFallback, isSafeDonorMessage } from "@/lib/ai-messages";
import { anthropicModel, getAnthropicClient } from "@/lib/anthropic";
import { donorsSeed, formatCurrency, getRiskReasons } from "@/lib/donors";
import {
  generateMessageRequestSchema,
  generateMessageResponseSchema,
} from "@/types/ai";

export const runtime = "nodejs";

const claudeMessageSchema = z.object({
  message: z.string().min(60).max(900),
});

export async function POST(request: Request) {
  const startedAt = Date.now();
  const body = await request.json().catch(() => null);
  const parsed = generateMessageRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "El donante indicado no es válido." }, { status: 400 });
  }

  const donor = donorsSeed.find((item) => item.id === parsed.data.donorId);

  if (!donor) {
    return NextResponse.json({ error: "No encontramos ese donante." }, { status: 404 });
  }

  const fallbackMessage = buildMessageFallback(donor);

  try {
    const client = getAnthropicClient();
    const response = await client.messages.parse({
      model: anthropicModel,
      max_tokens: 500,
      temperature: 0.4,
      system: `Redactás borradores de WhatsApp para Fundación Puente, una ONG argentina.
Escribí en español rioplatense, con tono humano, claro y respetuoso.
El mensaje debe incluir nombre, monto mensual, causa, impacto concreto, motivo del contacto y una sola acción.
No inventes datos. No pidas tarjeta, CBU, cuenta bancaria, claves, credenciales ni otros datos sensibles.
No digas que Pulso Donante procesa pagos ni que el mensaje se enviará automáticamente.
Ante un pago fallido, ofrecé enviar el link seguro de la organización para actualizar el medio de pago.
No agregues explicaciones fuera del mensaje.`,
      messages: [
        {
          role: "user",
          content: `Creá un único borrador usando solo estos datos:
${JSON.stringify({
  name: donor.name,
  monthlyAmount: formatCurrency(donor.monthlyAmount),
  cause: donor.cause,
  impact: donor.impactText,
  riskReasons: getRiskReasons(donor),
})}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(claudeMessageSchema),
      },
    });

    const message = response.parsed_output?.message.trim();

    if (!message || !isSafeDonorMessage(message)) {
      throw new Error("Claude returned an unsafe message.");
    }

    const result = generateMessageResponseSchema.parse({
      source: "claude",
      message,
    });

    logAiOperation("generate_donor_message", "success", startedAt, response._request_id);
    return NextResponse.json(result);
  } catch {
    logAiOperation("generate_donor_message", "fallback", startedAt);
    return NextResponse.json({
      source: "fallback",
      message: fallbackMessage,
      warning: "Claude no está disponible. Conservamos el mensaje seguro original.",
    });
  }
}

function logAiOperation(operation: string, result: string, startedAt: number, requestId?: string | null) {
  console.info("[ai]", {
    operation,
    result,
    latencyMs: Date.now() - startedAt,
    requestId: requestId ?? undefined,
  });
}

