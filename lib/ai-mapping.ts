import type { PaymentStatus } from "@/types/donor";
import {
  onboardingFields,
  suggestMappingResponseSchema,
  type OnboardingField,
  type SuggestMappingResponse,
} from "@/types/ai";

const columnAliases: Record<OnboardingField, string[]> = {
  name: ["donante", "nombre", "nombre completo"],
  phone: ["celular", "whatsapp", "celular whatsapp", "telefono", "teléfono"],
  monthlyAmount: ["aporte actual", "monto mensual", "aporte", "monto"],
  paymentStatus: ["estado ultimo cobro", "estado último cobro", "estado de pago", "estado"],
  lastPaymentDate: ["ultimo pago", "último pago", "fecha ultimo pago", "fecha último pago"],
  lastImpactContactDate: ["ultimo contacto", "último contacto", "contacto de impacto"],
  cause: ["programa", "causa", "proyecto"],
};

const normalizationAliases: Array<[string[], PaymentStatus]> = [
  [["ok", "pagado", "pago correcto", "aprobado"], "paid"],
  [["rechazado", "sin fondos", "fallido", "pago fallido"], "failed"],
  [["pendiente"], "pending"],
  [["vacio", "vacío", ""], "unknown"],
];

export const defaultStatusValues = ["OK", "Rechazado", "Sin fondos", "Pendiente", "Vacío"];

export function buildFallbackMapping(
  columns: string[],
  statusValues: string[] = defaultStatusValues,
): SuggestMappingResponse {
  const availableColumns = [...columns];
  const mappings = Object.fromEntries(
    onboardingFields.map((field) => {
      const match = availableColumns.find((column) =>
        columnAliases[field].includes(normalizeLabel(column)),
      );

      if (match) {
        availableColumns.splice(availableColumns.indexOf(match), 1);
      }

      return [field, match ?? ""];
    }),
  ) as Record<OnboardingField, string>;

  const normalizations = Object.fromEntries(
    statusValues.map((value) => [value, inferPaymentStatus(value)]),
  );

  return suggestMappingResponseSchema.parse({
    source: "fallback",
    mappings,
    normalizations,
  });
}

export function inferPaymentStatus(value: string): PaymentStatus {
  const normalizedValue = normalizeLabel(value === "Vacío" ? "" : value);
  return (
    normalizationAliases.find(([aliases]) => aliases.includes(normalizedValue))?.[1] ??
    "unknown"
  );
}

function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

