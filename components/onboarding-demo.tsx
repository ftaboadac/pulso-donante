"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { buildFallbackMapping, defaultStatusValues } from "@/lib/ai-mapping";
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
  "Programa",
];

const sampleRows = donorsSeed.slice(0, 5).map((donor, index) => ({
  Donante: donor.name,
  Celular: donor.phone,
  "Aporte actual": donor.monthlyAmount,
  "Estado último cobro": previewStatuses[index],
  "Último pago": donor.lastPaymentDate,
  "Último contacto": donor.lastImpactContactDate,
  Programa: donor.cause,
}));

const previewRows = donorsSeed.slice(0, 5).map((donor, index) => ({
  donor: donor.name,
  phone: formatPhone(donor.phone),
  amount: formatCurrency(donor.monthlyAmount),
  status: previewStatuses[index],
  lastPayment: formatShortDate(donor.lastPaymentDate),
  lastContact: formatShortDate(donor.lastImpactContactDate),
  program: donor.cause,
}));

const initialSuggestion = buildFallbackMapping(columns, defaultStatusValues);
let mappingRequest: Promise<SuggestMappingResponse> | null = null;

export function OnboardingDemo() {
  const router = useRouter();
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const cached = readCachedSuggestion();

    if (cached) {
      queueMicrotask(() => {
        if (!isMounted) {
          return;
        }

        setSuggestion(cached);
        setIsAnalyzing(false);
      });

      return () => {
        isMounted = false;
      };
    }

    void getMappingSuggestion({ columns, sampleRows }).then((result) => {
      if (!isMounted) {
        return;
      }

      sessionStorage.setItem(SUGGESTION_CACHE_KEY, JSON.stringify(result));
      setSuggestion(result);
      setIsAnalyzing(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Volver</Link>
        </Button>
      </div>

      <div>
        <span className="text-sm font-medium text-primary">Preparación de datos</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Revisá cómo interpretamos tu planilla
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Claude analiza las columnas y sugiere un mapeo inicial. Vos confirmás o corregís cada campo antes de detectar
          los casos en riesgo.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Vista previa de la planilla</h2>
          <span className="text-xs text-muted-foreground">donantes.xlsx · 10 filas</span>
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
                  <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{row.program}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-2 text-sm">
        {isAnalyzing ? (
          <>
            <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" />
            <span className="font-medium text-primary">Claude está analizando</span>
          </>
        ) : suggestion.source === "claude" ? (
          <>
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-primary">Sugerido por Claude</span>
          </>
        ) : (
          <>
            <Check className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-primary">Sugerencia local</span>
          </>
        )}
        <span className="text-muted-foreground">· Revisá cada selección antes de continuar</span>
      </div>

      {suggestion.warning && !isAnalyzing && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {suggestion.warning}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <MappingCard title="Mapeo sugerido de columnas" description="Campo de Pulso Donante → columna detectada">
          {mappingEntries.map(([field, selectedColumn]) => (
            <li
              key={field}
              className="grid gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-3 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center"
            >
              <span className="text-sm font-medium text-foreground">{onboardingFieldLabels[field]}</span>
              <ArrowRight className="hidden size-4 text-primary sm:block" aria-hidden="true" />
              <select
                value={selectedColumn}
                onChange={(event) => updateMapping(field, event.target.value)}
                disabled={isAnalyzing}
                aria-label={`Columna para ${onboardingFieldLabels[field]}`}
                className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-60"
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

        <MappingCard title="Normalización sugerida" description="Valor encontrado → estado interpretado">
          {Object.entries(suggestion.normalizations).map(([sourceValue, status]) => (
            <li
              key={sourceValue}
              className="grid gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-3 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center"
            >
              <span className="text-sm font-medium text-foreground">{sourceValue}</span>
              <ArrowRight className="hidden size-4 text-primary sm:block" aria-hidden="true" />
              <select
                value={status}
                onChange={(event) => updateNormalization(sourceValue, event.target.value as PaymentStatus)}
                disabled={isAnalyzing}
                aria-label={`Estado para ${sourceValue}`}
                className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-60"
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
        <Button size="lg" onClick={confirmMapping} disabled={isAnalyzing}>
          Detectar donantes en riesgo
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function MappingCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
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
        warning: "Claude no está disponible. Usamos una sugerencia local que podés revisar.",
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

function formatPhone(phone: string) {
  return phone.replace(/^(\+54)(9)(\d{2})(\d{4})(\d{4})$/, "$1 $2 $3 $4 $5");
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${date}T12:00:00`),
  );
}
