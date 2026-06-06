import { buildDonorMessage } from "@/lib/messages";
import type { Donor } from "@/types/donor";

const forbiddenFinancialTerms = [
  /\bCBU\b/i,
  /\bCVV\b/i,
  /\btarjeta\b/i,
  /datos (?:de la tarjeta|bancarios)/i,
  /contrase(?:ñ|n)a/i,
  /\bclave\b/i,
  /credenciales/i,
  /cuenta bancaria/i,
];

export function isSafeDonorMessage(message: string) {
  return (
    message.trim().length >= 60 &&
    message.length <= 900 &&
    !forbiddenFinancialTerms.some((pattern) => pattern.test(message))
  );
}

export function buildMessageFallback(donor: Donor) {
  return buildDonorMessage(donor);
}
