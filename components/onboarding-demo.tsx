"use client";

import { type ChangeEvent, type ReactNode, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Download, FileSpreadsheet, LoaderCircle, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildFallbackMapping, defaultStatusValues } from "@/lib/ai-mapping";
import { exportExampleSpreadsheet } from "@/lib/donor-export";
import { donorsSeed, formatCurrency } from "@/lib/donors";
import {
  onboardingFields,
  onboardingFieldLabels,
  paymentStatusMappingLabels,
  suggestMappingResponseSchema,
  type SuggestMappingRequest,
  type SuggestMappingResponse,
} from "@/types/ai";
import type { PaymentStatus } from "@/types/donor";

const SUGGESTION_CACHE_KEY = "pulso-donante-ai-mapping";
const CONFIRMED_MAPPING_KEY = "pulso-donante-confirmed-mapping";

const previewStatuses = ["Rechazado", "Sin fondos", "Rechazado", "Rechazado", "OK"];

const columns = [
  "Donante",
  "Celular",
  "Aporte actual",
  "Estado último cobro",
  "Último pago",
  "Último contacto",
  "Área de impacto",
];

const sampleRows = donorsSeed.slice(0, 5).map((donor, index) => ({
  Donante: donor.name,
  Celular: donor.phone,
  "Aporte actual": donor.monthlyAmount,
  "Estado último cobro": previewStatuses[index],
  "Último pago": donor.lastPaymentDate,
  "Último contacto": donor.lastImpactContactDate,
  "Área de impacto": donor.cause,
}));

const previewRows = donorsSeed.slice(0, 5).map((donor, index) => ({
  donor: donor.name,
  phone: formatPhone(donor.phone),
  amount: formatCurrency(donor.monthlyAmount),
  status: previewStatuses[index],
  lastPayment: formatShortDate(donor.lastPaymentDate),
  lastContact: formatShortDate(donor.lastImpactContactDate),
  impactArea: donor.cause,
}));

const initialSuggestion = buildFallbackMapping(columns, defaultStatusValues);
let mappingRequest: Promise<SuggestMappingResponse> | null = null;

export function OnboardingDemo() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisRunRef = useRef(0);
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [uploadedSpreadsheetName, setUploadedSpreadsheetName] = useState("");

  const mappingEntries = onboardingFields.map((field) => [field, suggestion.mappings[field]] as const);

  function updateMapping(field: (typeof onboardingFields)[number], column: string) {
    setValidationError("");
    setSuggestion((current) => ({
      ...current,
      mappings: {
        ...current.mappings,
        [field]: column,
      },
    }));
  }

  function updateNormalization(sourceValue: string, status: PaymentStatus) {
    setSuggestion((current) => ({
      ...current,
      normalizations: {
        ...current.normalizations,
        [sourceValue]: status,
      },
    }));
  }

  function confirmMapping() {
    const selectedColumns = Object.values(suggestion.mappings);
    const missingField = selectedColumns.some((column) => !column);
    const duplicatedColumn = new Set(selectedColumns).size !== selectedColumns.length;

    if (missingField) {
      setValidationError("Asigná una columna a cada campo antes de continuar.");
      return;
    }

    if (duplicatedColumn) {
      setValidationError("Cada campo debe usar una columna distinta.");
      return;
    }

    sessionStorage.setItem(
      CONFIRMED_MAPPING_KEY,
      JSON.stringify({
        mappings: suggestion.mappings,
        normalizations: suggestion.normalizations,
        source: suggestion.source,
      }),
    );
    router.push("/dashboard");
  }

  function downloadExampleSpreadsheet() {
    exportExampleSpreadsheet(donorsSeed);
  }

  function openSpreadsheetPicker() {
    fileInputRef.current?.click();
  }

  function registerSpreadsheetUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    event.target.value = "";
    void analyzeSpreadsheet(file.name);
  }

  async function analyzeSpreadsheet(fileName: string) {
    const currentRun = analysisRunRef.current + 1;
    analysisRunRef.current = currentRun;

    setUploadedSpreadsheetName(fileName);
    setHasStartedAnalysis(true);
    setIsAnalyzing(true);
    setValidationError("");

    const cached = readCachedSuggestion();
    const suggestionPromise = cached
      ? Promise.resolve(cached)
      : getMappingSuggestion({ columns, sampleRows }).then((result) => {
          sessionStorage.setItem(SUGGESTION_CACHE_KEY, JSON.stringify(result));
          return result;
        });

    const [result] = await Promise.all([suggestionPromise, wait(1200)]);

    if (analysisRunRef.current !== currentRun) {
      return;
    }

    setSuggestion(result);
    setIsAnalyzing(false);
  }

  const spreadsheetFileLabel = uploadedSpreadsheetName
    ? `${uploadedSpreadsheetName} · muestra cargada`
    : "Esperando archivo de ejemplo";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Planilla demo</p>
          <p className="text-sm text-muted-foreground">{spreadsheetFileLabel}</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Volver</Link>
        </Button>
      </div>

      <div>
        <span className="text-sm font-medium text-primary">Carga de datos</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Subí la planilla de ejemplo para iniciar la demo
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Descargá el archivo, volvé a subirlo y Pulso va a analizar columnas y primeras filas antes de mostrarte el
          mapeo sugerido. La persona de la ONG confirma todo antes de procesar.
        </p>
      </div>

      <section className="grid gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
            <FileSpreadsheet className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">Planilla de Fundación Puente</h2>
            {uploadedSpreadsheetName ? (
              <p className="mt-1 inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Check className="size-3.5" aria-hidden="true" />
                <span className="truncate">Archivo cargado: {uploadedSpreadsheetName}</span>
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button type="button" variant="outline" onClick={downloadExampleSpreadsheet}>
            <Download className="size-4" aria-hidden="true" />
            Descargar Excel de ejemplo
          </Button>
          <Button type="button" onClick={openSpreadsheetPicker}>
            <Upload className="size-4" aria-hidden="true" />
            Subir CSV/Excel
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={registerSpreadsheetUpload}
          />
        </div>
      </section>

      {isAnalyzing && (
        <section
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          aria-label="Análisis de la planilla"
          aria-live="polite"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Claude está analizando {uploadedSpreadsheetName}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Leyendo columnas y valores de ejemplo
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Detectamos encabezados como Donante, Celular, Aporte actual y Estado último cobro. En unos segundos vas
                a poder revisar el mapeo sugerido antes de continuar.
              </p>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                <span className="rounded-lg bg-secondary px-3 py-2">Validando columnas</span>
                <span className="rounded-lg bg-secondary px-3 py-2">Interpretando estados</span>
                <span className="rounded-lg bg-secondary px-3 py-2">Preparando sugerencia</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {hasStartedAnalysis && !isAnalyzing && (
        <>
          <section className="grid gap-3 md:grid-cols-3" aria-label="Cómo funciona el mapeo">
            <ProcessStep
              number="1"
              title="Leemos la planilla"
              description="Mostramos una muestra realista para que puedas reconocer los datos de origen."
            />
            <ProcessStep
              number="2"
              title="Sugerimos el mapeo"
              description="La IA propone columnas y estados; las heurísticas locales cubren el fallback."
            />
            <ProcessStep
              number="3"
              title="Vos confirmás"
              description="Recién después aplicamos reglas determinísticas para priorizar donantes."
            />
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold text-foreground">Vista previa de la planilla</h2>
              <span className="text-xs text-muted-foreground">{spreadsheetFileLabel}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-sm">
                <thead>
                  <tr className="bg-secondary">
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={row.donor} className="border-t border-border hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">{row.donor}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.phone}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{row.amount}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.status}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.lastPayment}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.lastContact}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.impactArea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex items-center gap-2 text-sm">
            {suggestion.source === "claude" ? (
              <>
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                <span className="font-medium text-primary">Sugerido por IA</span>
              </>
            ) : (
              <>
                <Check className="size-4 text-primary" aria-hidden="true" />
                <span className="font-medium text-primary">Sugerencia local</span>
              </>
            )}
            <span className="text-muted-foreground">· Revisá cada selección antes de continuar</span>
          </div>

          {suggestion.warning && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {suggestion.warning}
            </p>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <MappingCard
              title="Mapeo de columnas"
              description="Izquierda: dato que necesita Pulso Donante. Derecha: columna de tu planilla."
            >
              {mappingEntries.map(([field, selectedColumn]) => (
                <li
                  key={field}
                  className="grid gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-3 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center"
                >
                  <span className="text-sm font-medium text-foreground">{onboardingFieldLabels[field]}</span>
                  <ArrowRight className="hidden size-4 text-primary sm:block" aria-hidden="true" />
                  <select
                    value={selectedColumn}
                    onChange={(event) => updateMapping(field, event.target.value)}
                    aria-label={`Columna para ${onboardingFieldLabels[field]}`}
                    className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                  >
                    <option value="">Elegir columna</option>
                    {columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </MappingCard>

            <MappingCard
              title="Estados de pago"
              description="Cuando la planilla dice esto, Pulso lo interpreta como este estado."
            >
              {Object.entries(suggestion.normalizations).map(([sourceValue, status]) => (
                <li
                  key={sourceValue}
                  className="grid gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-3 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center"
                >
                  <span className="text-sm font-medium text-foreground">{sourceValue}</span>
                  <ArrowRight className="hidden size-4 text-primary sm:block" aria-hidden="true" />
                  <select
                    value={status}
                    onChange={(event) => updateNormalization(sourceValue, event.target.value as PaymentStatus)}
                    aria-label={`Estado para ${sourceValue}`}
                    className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                  >
                    {Object.entries(paymentStatusMappingLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </MappingCard>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Todo listo. Se analizarán 10 donantes con reglas transparentes y auditables.
              </p>
              {validationError && <p className="mt-2 text-sm font-medium text-destructive">{validationError}</p>}
            </div>
            <Button size="lg" onClick={confirmMapping}>
              Detectar donantes en riesgo
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function MappingCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <ul className="mt-4 flex flex-col gap-2">{children}</ul>
    </section>
  );
}

async function getMappingSuggestion(request: SuggestMappingRequest) {
  if (!mappingRequest) {
    mappingRequest = fetch("/api/ai/suggest-mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la sugerencia.");
        }

        return suggestMappingResponseSchema.parse(await response.json());
      })
      .catch(() => ({
        ...buildFallbackMapping(request.columns, defaultStatusValues),
        warning: "La IA no está disponible. Usamos una sugerencia local que podés revisar.",
      }));
  }

  return mappingRequest;
}

function readCachedSuggestion() {
  const cached = sessionStorage.getItem(SUGGESTION_CACHE_KEY);

  if (!cached) {
    return null;
  }

  try {
    const parsed = suggestMappingResponseSchema.safeParse(JSON.parse(cached));
    return parsed.success ? parsed.data : null;
  } catch {
    sessionStorage.removeItem(SUGGESTION_CACHE_KEY);
    return null;
  }
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatPhone(phone: string) {
  return phone.replace(/^(\+54)(9)(\d{2})(\d{4})(\d{4})$/, "$1 $2 $3 $4 $5");
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {number}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
