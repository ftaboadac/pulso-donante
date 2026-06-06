import Papa from "papaparse";

import type { Donor, PaymentStatus } from "@/types/donor";
import type { ColumnMapping, MappableField, MappingSuggestion, StatusNormalization } from "@/types/import";

/** Fecha de referencia alineada con las reglas de riesgo (`lib/risk.ts`). */
const REFERENCE_DATE = new Date("2026-06-06T12:00:00");
const STALE_AMOUNT_DAYS = 200;

export type ParsedSheet = {
  headers: string[];
  rows: Record<string, string>[];
};

export function parseCsv(text: string): ParsedSheet {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const rows = result.data.filter((row) => Object.values(row).some((value) => String(value ?? "").trim() !== ""));
  const headers = result.meta.fields?.map((field) => field.trim()) ?? [];

  return { headers, rows };
}

export function normalizePhone(raw: string | undefined): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export function normalizeAmount(raw: string | undefined): number | null {
  const cleaned = String(raw ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  if (cleaned.trim() === "") {
    return null;
  }

  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value) : null;
}

const STATUS_KEYWORDS: { match: RegExp; status: PaymentStatus }[] = [
  { match: /rechaz|fallid|sin fondo|impag|error|declin/i, status: "failed" },
  { match: /aprob|ok|pagad|cobrad|acredit|correct|exito/i, status: "paid" },
  { match: /pendien|revis|proces/i, status: "pending" },
];

export function normalizeStatusValue(raw: string | undefined, normalization?: StatusNormalization): PaymentStatus {
  const value = String(raw ?? "").trim();

  if (value === "") {
    return "unknown";
  }

  if (normalization) {
    const direct = normalization[value] ?? normalization[value.toLowerCase()];
    if (direct) {
      return direct;
    }
  }

  return STATUS_KEYWORDS.find((entry) => entry.match.test(value))?.status ?? "unknown";
}

/** Devuelve los valores únicos de estado encontrados en la planilla, para mostrar la normalización. */
export function collectStatusValues(rows: Record<string, string>[], statusColumn: string | null): string[] {
  if (!statusColumn) {
    return [];
  }

  const values = new Set<string>();
  for (const row of rows) {
    const value = String(row[statusColumn] ?? "").trim();
    if (value) {
      values.add(value);
    }
  }
  return [...values];
}

export function buildStatusNormalization(values: string[]): StatusNormalization {
  return Object.fromEntries(values.map((value) => [value, normalizeStatusValue(value)]));
}

const FIELD_KEYWORDS: { field: MappableField; match: RegExp }[] = [
  { field: "name", match: /nombre|donante|apellido/i },
  { field: "phone", match: /celular|tel[eé]fono|whatsapp|m[oó]vil|cel\b/i },
  { field: "paymentStatus", match: /estado|cobro|pago/i },
  { field: "lastPaymentDate", match: /[uú]ltimo aporte|fecha|[uú]ltimo pago|cobro/i },
  { field: "cause", match: /programa|causa|proyecto|campa[ñn]a/i },
  { field: "monthlyAmount", match: /aporte|monto|importe|cuota|donaci[oó]n/i },
];

/** Heurística determinística de mapeo, usada como fallback si la IA no está disponible. */
export function suggestMappingHeuristic(sheet: ParsedSheet): MappingSuggestion {
  const { headers, rows } = sheet;
  const columnMapping: ColumnMapping = {
    name: null,
    phone: null,
    monthlyAmount: null,
    paymentStatus: null,
    lastPaymentDate: null,
    cause: null,
  };

  const used = new Set<string>();
  const amountColumns = headers.filter((header) => /aporte|monto|importe|cuota|donaci[oó]n/i.test(header));

  for (const { field, match } of FIELD_KEYWORDS) {
    if (columnMapping[field]) {
      continue;
    }

    if (field === "monthlyAmount" && amountColumns.length > 0) {
      // Para montos por mes, usamos la última columna (más reciente).
      const latest = amountColumns[amountColumns.length - 1];
      columnMapping.monthlyAmount = latest;
      used.add(latest);
      continue;
    }

    const candidate = headers.find((header) => !used.has(header) && match.test(header));
    if (candidate) {
      columnMapping[field] = candidate;
      used.add(candidate);
    }
  }

  const statusValues = collectStatusValues(rows, columnMapping.paymentStatus);

  return {
    columnMapping,
    statusNormalization: buildStatusNormalization(statusValues),
    source: "heuristic",
  };
}

function slugify(value: string, index: number): string {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base ? `${base}-${index}` : `donante-${index}`;
}

function offsetDate(days: number): string {
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function normalizeDate(raw: string | undefined): string | null {
  const value = String(raw ?? "").trim();
  if (!value) {
    return null;
  }

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const dmy = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return null;
}

/** Detecta si la serie de aportes mensuales viene en baja (monto licuado por inflación). */
function detectDecliningAmount(row: Record<string, string>, amountColumns: string[]): boolean {
  const series = amountColumns
    .map((column) => normalizeAmount(row[column]))
    .filter((value): value is number => value !== null);

  if (series.length < 2) {
    return false;
  }

  return series[series.length - 1] < series[0];
}

const DEFAULT_CAUSE = "Programa general";
const DEFAULT_IMPACT = "tu aporte sostiene los programas de la organización";

export function transformToDonors(sheet: ParsedSheet, mapping: ColumnMapping, normalization: StatusNormalization): Donor[] {
  const { headers, rows } = sheet;
  const amountColumns = headers.filter((header) => /aporte|monto|importe|cuota|donaci[oó]n/i.test(header));

  return rows.map((row, index) => {
    const name = String(row[mapping.name ?? ""] ?? "").trim() || `Donante ${index + 1}`;
    const monthlyAmount = normalizeAmount(row[mapping.monthlyAmount ?? ""]) ?? 0;
    const paymentStatus = normalizeStatusValue(row[mapping.paymentStatus ?? ""], normalization);
    const lastPaymentDate = normalizeDate(row[mapping.lastPaymentDate ?? ""]) ?? offsetDate(0);
    const declining = detectDecliningAmount(row, amountColumns);
    const cause = (mapping.cause ? String(row[mapping.cause] ?? "").trim() : "") || DEFAULT_CAUSE;

    return {
      id: slugify(name, index),
      name,
      phone: normalizePhone(row[mapping.phone ?? ""]),
      monthlyAmount,
      paymentStatus,
      lastPaymentDate,
      lastAmountUpdateDate: declining ? offsetDate(STALE_AMOUNT_DAYS) : lastPaymentDate,
      lastImpactContactDate: lastPaymentDate,
      cause,
      impactText: DEFAULT_IMPACT,
      followUpStatus: "pending",
    } satisfies Donor;
  });
}
