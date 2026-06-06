import { suggestMappingHeuristic, type ParsedSheet } from "@/lib/csv";
import type { MappableField, MappingRequest, MappingSuggestion } from "@/types/import";

/**
 * Endpoint que implementa backend (mapeo asistido por IA).
 * Recibe `MappingRequest` y devuelve `MappingSuggestion` con `source: "ai"`.
 */
const MAPPING_ENDPOINT = "/api/ai/map-columns";
const SAMPLE_SIZE = 5;
const MAPPABLE_FIELDS: MappableField[] = ["name", "phone", "monthlyAmount", "paymentStatus", "lastPaymentDate", "cause"];

function isValidSuggestion(value: unknown): value is MappingSuggestion {
  if (!value || typeof value !== "object") {
    return false;
  }

  const suggestion = value as Partial<MappingSuggestion>;
  if (!suggestion.columnMapping || typeof suggestion.columnMapping !== "object") {
    return false;
  }

  return MAPPABLE_FIELDS.every((field) => field in (suggestion.columnMapping as object));
}

/**
 * Pide a la API el mapeo asistido por IA. Si la API no está disponible o responde algo inválido,
 * cae a la heurística determinística para que el loop siga funcionando (requisito del MVP).
 */
export async function requestMappingSuggestion(sheet: ParsedSheet): Promise<MappingSuggestion> {
  const fallback = suggestMappingHeuristic(sheet);

  try {
    const payload: MappingRequest = {
      headers: sheet.headers,
      sampleRows: sheet.rows.slice(0, SAMPLE_SIZE),
    };

    const response = await fetch(MAPPING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return fallback;
    }

    const data: unknown = await response.json();
    if (!isValidSuggestion(data)) {
      return fallback;
    }

    return {
      columnMapping: { ...fallback.columnMapping, ...data.columnMapping },
      statusNormalization: { ...fallback.statusNormalization, ...data.statusNormalization },
      source: "ai",
    };
  } catch {
    return fallback;
  }
}
