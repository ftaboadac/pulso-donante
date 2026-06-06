import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { donorsSeed, formatCurrency } from "@/lib/donors";

const previewStatuses = ["Rechazado", "Sin fondos", "Rechazado", "Rechazado", "OK"];

const previewRows = donorsSeed.slice(0, 5).map((donor, index) => ({
  donor: donor.name,
  phone: formatPhone(donor.phone),
  amount: formatCurrency(donor.monthlyAmount),
  status: previewStatuses[index],
  lastPayment: formatShortDate(donor.lastPaymentDate),
  lastContact: formatShortDate(donor.lastImpactContactDate),
  program: donor.cause,
}));

const mappings = [
  ["Nombre", "Donante"],
  ["WhatsApp", "Celular"],
  ["Monto mensual", "Aporte actual"],
  ["Estado de pago", "Estado último cobro"],
  ["Último pago", "Último pago"],
  ["Último contacto", "Último contacto"],
  ["Causa", "Programa"],
];

const normalizations = [
  ["OK", "Pago correcto"],
  ["Rechazado", "Pago fallido"],
  ["Sin fondos", "Pago fallido"],
  ["Pendiente", "Pendiente"],
  ["Vacío", "Desconocido"],
];

const columns = [
  "Donante",
  "Celular",
  "Aporte actual",
  "Estado último cobro",
  "Último pago",
  "Último contacto",
  "Programa",
];

export function OnboardingDemo() {
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
          Analizamos las columnas y sugerimos un mapeo inicial. Todo está preseleccionado, pero vos confirmás antes de
          detectar los casos en riesgo.
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

      <div className="grid gap-6 lg:grid-cols-2">
        <MappingCard
          title="Mapeo sugerido de columnas"
          description="Campo de Pulso Donante → columna detectada"
          items={mappings}
        />
        <MappingCard
          title="Normalización sugerida"
          description="Valor encontrado → estado interpretado"
          items={normalizations}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Todo listo. Se analizarán 10 donantes con reglas transparentes y auditables.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Detectar donantes en riesgo
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function MappingCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[][];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map(([source, target]) => (
          <li
            key={`${source}-${target}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent ring-1 ring-inset ring-primary/20">
              <Check className="size-3.5 text-primary" aria-hidden="true" />
            </span>
            <span className="min-w-28 flex-1 text-sm font-medium text-foreground">{source}</span>
            <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="flex-1 text-sm text-muted-foreground">{target}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatPhone(phone: string) {
  return phone.replace(/^(\+54)(9)(\d{2})(\d{4})(\d{4})$/, "$1 $2 $3 $4 $5");
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${date}T12:00:00`),
  );
}
