"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileSpreadsheet, Loader2, Sparkles, Upload, Wand2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  collectStatusValues,
  normalizeStatusValue,
  parseCsv,
  transformToDonors,
  type ParsedSheet,
} from "@/lib/csv";
import { paymentStatusLabels } from "@/lib/donors";
import { requestMappingSuggestion } from "@/lib/mapping";
import { loadDonors } from "@/lib/store";
import type { PaymentStatus } from "@/types/donor";
import type { ColumnMapping, MappableField, StatusNormalization } from "@/types/import";

const DEMO_CSV_URL = "/datos-demo/donantes-demo.csv";
const PREVIEW_ROWS = 5;

const fieldLabels: { field: MappableField; label: string; required?: boolean }[] = [
  { field: "name", label: "Nombre del donante", required: true },
  { field: "phone", label: "Teléfono / WhatsApp", required: true },
  { field: "monthlyAmount", label: "Aporte mensual", required: true },
  { field: "paymentStatus", label: "Estado del último cobro", required: true },
  { field: "lastPaymentDate", label: "Fecha del último aporte" },
  { field: "cause", label: "Programa / causa" },
];

const paymentStatusOptions = Object.entries(paymentStatusLabels) as [PaymentStatus, string][];

type Step = "idle" | "review";

export function OnboardingImporter() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [normalization, setNormalization] = useState<StatusNormalization>({});
  const [source, setSource] = useState<"ai" | "heuristic">("heuristic");

  async function processText(text: string) {
    setError(null);
    setLoading(true);

    try {
      const parsed = parseCsv(text);

      if (parsed.rows.length === 0) {
        setError("No encontramos filas en la planilla. Revisá el archivo e intentá de nuevo.");
        return;
      }

      const suggestion = await requestMappingSuggestion(parsed);
      setSheet(parsed);
      setMapping(suggestion.columnMapping);
      setNormalization(suggestion.statusNormalization);
      setSource(suggestion.source);
      setStep("review");
    } catch {
      setError("No pudimos leer la planilla. Asegurate de que sea un CSV válido.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDemo() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(DEMO_CSV_URL);
      if (!response.ok) {
        throw new Error("demo");
      }
      const text = await response.text();
      await processText(text);
    } catch {
      setError("No pudimos cargar la planilla de demo.");
      setLoading(false);
    }
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const text = await file.text();
    await processText(text);
  }

  const statusValues = useMemo(
    () => (sheet && mapping ? collectStatusValues(sheet.rows, mapping.paymentStatus) : []),
    [sheet, mapping],
  );

  function updateMapping(field: MappableField, value: string) {
    setMapping((current) => (current ? { ...current, [field]: value || null } : current));
  }

  function updateNormalization(value: string, status: PaymentStatus) {
    setNormalization((current) => ({ ...current, [value]: status }));
  }

  function confirm() {
    if (!sheet || !mapping) {
      return;
    }
    const donors = transformToDonors(sheet, mapping, normalization);
    loadDonors(donors);
    router.push("/dashboard");
  }

  const requiredMissing =
    !mapping || fieldLabels.some((item) => item.required && !mapping[item.field]);

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
          Cargá tu planilla de donantes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Subí un CSV o usá la planilla de demo. Analizamos las columnas, sugerimos el mapeo y la normalización de
          estados; vos confirmás antes de detectar los casos en riesgo.
        </p>
      </div>

      {step === "idle" ? (
        <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <FileSpreadsheet className="size-6" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-foreground">Elegí cómo empezar</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            La planilla de demo tiene datos realistas con pagos rechazados, montos en baja y datos incompletos.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={loadDemo} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Subir Excel DEMO
            </Button>
            <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              <Upload />
              Subir mi CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFile}
            />
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>
      ) : null}

      {step === "review" && sheet && mapping ? (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold text-foreground">Vista previa de la planilla</h2>
              <span className="text-xs text-muted-foreground">{sheet.rows.length} filas detectadas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-secondary">
                    {sheet.headers.map((header) => (
                      <th
                        key={header}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheet.rows.slice(0, PREVIEW_ROWS).map((row, index) => (
                    <tr key={index} className="border-t border-border hover:bg-secondary/50">
                      {sheet.headers.map((header) => (
                        <td key={header} className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {row[header] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-accent/40 px-4 py-2.5 text-sm text-accent-foreground">
            <Wand2 className="size-4 shrink-0 text-primary" />
            {source === "ai"
              ? "Mapeo sugerido por IA. Revisalo y corregilo antes de continuar."
              : "Mapeo sugerido automáticamente. Revisalo y corregilo antes de continuar."}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">Mapeo de columnas</h2>
              <p className="mt-1 text-xs text-muted-foreground">Campo de Pulso Donante → columna de tu planilla</p>
              <ul className="mt-4 flex flex-col gap-3">
                {fieldLabels.map(({ field, label, required }) => (
                  <li key={field} className="grid gap-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-red-600">*</span> : null}
                    </span>
                    <select
                      value={mapping[field] ?? ""}
                      onChange={(event) => updateMapping(field, event.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                    >
                      <option value="">Sin asignar</option>
                      {sheet.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">Normalización de estados</h2>
              <p className="mt-1 text-xs text-muted-foreground">Valor encontrado → estado interpretado</p>
              {statusValues.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-3">
                  {statusValues.map((value) => (
                    <li key={value} className="grid grid-cols-[1fr_auto] items-center gap-3">
                      <span className="truncate text-sm font-medium text-foreground" title={value}>
                        {value}
                      </span>
                      <select
                        value={normalization[value] ?? normalizeStatusValue(value)}
                        onChange={(event) => updateNormalization(value, event.target.value as PaymentStatus)}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                      >
                        {paymentStatusOptions.map(([statusValue, statusLabel]) => (
                          <option key={statusValue} value={statusValue}>
                            {statusLabel}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Asigná la columna de estado de cobro para revisar la normalización.
                </p>
              )}
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">
              {requiredMissing ? (
                <span className="text-amber-700">Asigná los campos obligatorios (*) para continuar.</span>
              ) : (
                <span>
                  Todo listo. Se analizarán {sheet.rows.length} donantes con reglas transparentes y auditables.
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("idle")}>
                Cambiar planilla
              </Button>
              <Button size="lg" onClick={confirm} disabled={requiredMissing}>
                Detectar donantes en riesgo
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
