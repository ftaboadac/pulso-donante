import { z } from "zod";

import type { PaymentStatus } from "@/types/donor";

export const onboardingFields = [
  "name",
  "phone",
  "monthlyAmount",
  "paymentStatus",
  "lastPaymentDate",
  "lastImpactContactDate",
  "cause",
] as const;

export type OnboardingField = (typeof onboardingFields)[number];

export const onboardingFieldLabels: Record<OnboardingField, string> = {
  name: "Nombre",
  phone: "WhatsApp",
  monthlyAmount: "Monto mensual",
  paymentStatus: "Estado de pago",
  lastPaymentDate: "Último pago",
  lastImpactContactDate: "Último contacto",
  cause: "Causa",
};

export const paymentStatuses = ["paid", "failed", "pending", "unknown"] as const satisfies PaymentStatus[];

export const paymentStatusMappingLabels: Record<PaymentStatus, string> = {
  paid: "Pago correcto",
  failed: "Pago fallido",
  pending: "Pendiente",
  unknown: "Desconocido",
};

const sampleValueSchema = z.union([z.string().max(200), z.number().finite(), z.null()]);

export const suggestMappingRequestSchema = z.object({
  columns: z.array(z.string().trim().min(1).max(80)).min(1).max(20),
  sampleRows: z
    .array(z.record(z.string().trim().min(1).max(80), sampleValueSchema))
    .max(5),
});

export const mappingSchema = z.object({
  name: z.string(),
  phone: z.string(),
  monthlyAmount: z.string(),
  paymentStatus: z.string(),
  lastPaymentDate: z.string(),
  lastImpactContactDate: z.string(),
  cause: z.string(),
});

export const normalizationSchema = z.record(z.string(), z.enum(paymentStatuses));

export const suggestMappingResponseSchema = z.object({
  source: z.enum(["claude", "fallback"]),
  mappings: mappingSchema,
  normalizations: normalizationSchema,
  warning: z.string().optional(),
});

export type SuggestMappingRequest = z.infer<typeof suggestMappingRequestSchema>;
export type SuggestMappingResponse = z.infer<typeof suggestMappingResponseSchema>;

export const generateMessageRequestSchema = z.object({
  donorId: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
});

export const generateMessageResponseSchema = z.object({
  source: z.enum(["claude", "fallback"]),
  message: z.string(),
  warning: z.string().optional(),
});

export type GenerateMessageRequest = z.infer<typeof generateMessageRequestSchema>;
export type GenerateMessageResponse = z.infer<typeof generateMessageResponseSchema>;

