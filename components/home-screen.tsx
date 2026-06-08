import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";

import { DemoStartButton } from "@/components/demo-start-button";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const proofPoints = [
  "10 donantes cargados",
  "4 pagos rechazados prioritarios",
  "$34.500 mensuales en riesgo crítico",
];

const queue = [
  { name: "Valentina Torres", amount: "$12.000", reason: "Pago rechazado + falta contar impacto" },
  { name: "Florencia Herrera", amount: "$9.500", reason: "Pago rechazado + seguimiento pendiente" },
  { name: "Juan Pérez", amount: "$8.000", reason: "Pago rechazado + monto desactualizado" },
  { name: "María Gómez", amount: "$5.000", reason: "Pago rechazado · recuperable en demo" },
];

export function HomeScreen() {
  return (
    <div className="warm-shell min-h-screen text-foreground">
      <header className="border-b border-border bg-card/82 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/dashboard">Ver dashboard</Link>
            </Button>
            <DemoStartButton />
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-card/86 px-3 py-2 text-sm font-semibold text-primary shadow-sm">
              <ShieldCheck className="size-4" />
              La app sugiere. La persona decide.
            </div>
            <h1 className="mt-6 max-w-xl text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Una cola simple para cuidar donantes a tiempo.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Pulso Donante convierte una planilla en una cola clara de acciones: riesgo, mensaje editable, WhatsApp y
              seguimiento con ingreso preservado.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <DemoStartButton />
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">
                  Saltar al tablero
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="mt-7 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg border border-border bg-card/92 px-3 py-2 shadow-xs">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel overflow-hidden rounded-lg">
            <div className="warm-hero border-b border-white/10 px-4 py-4 text-white sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/58">Sala de cuidado</p>
                  <h2 className="mt-1 text-xl font-semibold">Prioridad de hoy</h2>
                </div>
                <div className="rounded-lg bg-white/10 px-3 py-2 text-right ring-1 ring-white/10">
                  <p className="text-xs text-white/60">En juego anual</p>
                  <p className="text-lg font-semibold">$414.000</p>
                </div>
              </div>
            </div>

            <div className="grid border-b border-border bg-card sm:grid-cols-3">
              <PreviewMetric label="Crítico mensual" value="$34.500" tone="danger" />
              <PreviewMetric label="Pagos rechazados" value="4" tone="warning" />
              <PreviewMetric label="Recuperado inicial" value="$0" tone="success" />
            </div>

            <div className="divide-y divide-border bg-card">
              {queue.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-foreground">
                        {index + 1}
                      </span>
                      <p className="truncate font-semibold text-foreground">{item.name}</p>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{item.reason}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-red-800">{item.amount}</p>
                    <p className="text-xs text-muted-foreground">mensual</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 border-t border-border bg-secondary/70 p-4 sm:grid-cols-3">
              <DemoStep icon={ClipboardCheck} label="Diagnóstico" />
              <DemoStep icon={MessageCircle} label="WhatsApp editable" />
              <DemoStep icon={HeartHandshake} label="Recuperación" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PreviewMetric({ label, value, tone }: { label: string; value: string; tone: "danger" | "warning" | "success" }) {
  const toneClass = {
    danger: "text-red-700",
    warning: "text-amber-700",
    success: "text-emerald-700",
  }[tone];

  return (
    <div className="border-b border-border px-4 py-4 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className={`text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function DemoStep({ icon: Icon, label }: { icon: typeof ClipboardCheck; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs">
      <Icon className="size-4 text-primary" />
      {label}
    </div>
  );
}
