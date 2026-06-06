"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileSpreadsheet, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const previewRows = [
  ["María Gómez", "+54 9 11 5555 4444", "$5.000", "Rechazado"],
  ["Laura Martínez", "+54 9 11 6321 4987", "$8.000", "Sin fondos"],
  ["Carlos Rodríguez", "+54 9 11 6980 1142", "$3.500", "OK"],
  ["Camila Ruiz", "+54 9 11 6002 7134", "$6.000", "Pendiente"],
];

const mappings = [
  ["Donante", "Nombre"],
  ["Celular / WhatsApp", "Teléfono"],
  ["Aporte actual", "Monto mensual"],
  ["Estado último cobro", "Estado de pago"],
  ["Programa", "Causa"],
];

const normalizations = [
  ["OK / Pagado / Cobrado", "Pago correcto"],
  ["Rechazado / Fallido / Sin fondos", "Pago fallido"],
  ["Pendiente / A revisar", "Pendiente"],
  ["Vacío", "Desconocido"],
];

export function OnboardingDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Demo guiada · Paso {step} de 3</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tu planilla, sin obligarte a cambiarla</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pulso Donante interpreta columnas y valores comunes. Vos confirmás antes de continuar.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2" aria-label="Progreso del onboarding">
        {["Vista previa", "Mapeo", "Normalización"].map((label, index) => {
          const current = index + 1;
          return (
            <div key={label}>
              <div className={cn("h-1.5 rounded-full", current <= step ? "bg-primary" : "bg-muted")} />
              <p className={cn("mt-2 text-xs font-medium", current <= step ? "text-primary" : "text-muted-foreground")}>
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader className="sm:flex sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-primary" />
                donantes_junio.csv
              </CardTitle>
              <CardDescription className="mt-2">10 filas detectadas · La planilla de ejemplo ya está cargada.</CardDescription>
            </div>
            <span className="mt-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground sm:mt-0">
              Lista para revisar
            </span>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {["Donante", "Celular / WhatsApp", "Aporte actual", "Estado último cobro"].map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row[0]}>
                    {row.map((cell) => (
                      <TableCell key={cell}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmá qué significa cada columna</CardTitle>
            <CardDescription>Preseleccionamos el mapeo más probable. En una importación real podrías corregirlo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mappings.map(([source, target]) => (
              <div key={source} className="grid items-center gap-2 rounded-xl border p-4 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-xs text-muted-foreground">En tu planilla</p>
                  <p className="font-medium">{source}</p>
                </div>
                <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />
                <div className="rounded-lg bg-secondary px-3 py-2">
                  <p className="text-xs text-muted-foreground">En Pulso Donante</p>
                  <p className="font-medium text-secondary-foreground">{target}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Normalización sugerida
            </CardTitle>
            <CardDescription>Agrupamos distintas formas de escribir el mismo estado. Las reglas son visibles y editables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {normalizations.map(([source, target]) => (
              <div key={source} className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Valores encontrados</p>
                  <p className="font-medium">{source}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
                  <Check className="size-4" />
                  {target}
                </div>
              </div>
            ))}
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              Se cargarán 10 donantes: 4 con pagos rechazados prioritarios y 3 casos adicionales de seguimiento.
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>
          <ArrowLeft />
          Atrás
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((current) => current + 1)}>
            Confirmar y continuar
            <ArrowRight />
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard">
              Ver casos priorizados
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
