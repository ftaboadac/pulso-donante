import type { PaymentStatus } from "@/types/donor";

/**
 * Contrato entre el front (importador de planilla) y la API de mapeo asistido.
 *
 * Flujo:
 *  1. El front parsea el CSV y arma `MappingRequest` con los encabezados y filas de muestra.
 *  2. La API (a cargo de backend, en `app/api/ai/map-columns`) devuelve un `MappingSuggestion`.
 *  3. El front muestra la sugerencia como EDITABLE. La persona confirma o corrige.
 *  4. Recién con la confirmación humana se transforma la planilla a `Donor[]`.
 *
 * Si la API falla o no está disponible, el front usa una heurística determinística
 * (`suggestMappingHeuristic`) para que el loop principal siga funcionando.
 */

/** Campos internos del modelo que se pueden mapear desde una columna de la planilla. */
export type MappableField =
  | "name"
  | "phone"
  | "monthlyAmount"
  | "paymentStatus"
  | "lastPaymentDate"
  | "cause";

/** Mapeo de campo interno -> nombre de columna detectada en la planilla (o null si no hay). */
export type ColumnMapping = Record<MappableField, string | null>;

/** Normalización de un valor crudo de estado de pago hacia el enum interno. */
export type StatusNormalization = Record<string, PaymentStatus>;

export type MappingRequest = {
  headers: string[];
  /** Primeras filas como objetos columna->valor, para que la IA infiera el mapeo. */
  sampleRows: Record<string, string>[];
};

export type MappingSuggestion = {
  columnMapping: ColumnMapping;
  statusNormalization: StatusNormalization;
  /** Origen de la sugerencia, para mostrarlo en la UI. */
  source: "ai" | "heuristic";
};
