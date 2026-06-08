"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Download, HeartHandshake, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

import { DonorTable } from "@/components/DonorTable";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { useDonors } from "@/hooks/use-donors";
import { exportDonorsForImport } from "@/lib/donor-export";
import {
  formatCurrency,
  getDashboardMetrics,
  getDonorRisk,
  getRiskFlags,
  sortDonorsByPriority,
} from "@/lib/donors";
import type { Donor } from "@/types/donor";

type QueueView = "priority" | "failed" | "follow_up" | "resolved";

const queueViews: { key: QueueView; label: string; description: string }[] = [
  { key: "priority", label: "Prioridad de hoy", description: "Casos activos ordenados por urgencia e impacto." },
  { key: "failed", label: "Pagos rechazados", description: "Aportes que pueden perderse si no se contactan rápido." },
  { key: "follow_up", label: "Seguimiento preventivo", description: "Vínculos que necesitan actualización o impacto." },
  { key: "resolved", label: "Ya resueltos", description: "Casos recuperados o dados de baja en esta demo." },
];

export function DonorDashboard() {
  const router = useRouter();
  const { donors, resetDonors } = useDonors();
  const [view, setView] = useState<QueueView>("priority");
  const metrics = getDashboardMetrics(donors);
  const sortedDonors = useMemo(() => sortDonorsByPriority(donors), [donors]);
  const visibleDonors = sortedDonors.filter((donor) => matchesView(donor, view));
  const selectedView = queueViews.find((item) => item.key === view) ?? queueViews[0];
  const nextDonor = sortedDonors.find((donor) => matchesView(donor, "priority"));

  function restartDemo() {
    resetDonors();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <section className="surface-panel overflow-hidden rounded-lg">
        <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
          <div className="warm-hero p-5 text-white sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">Cola de cuidado</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Donantes que necesitan atención</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                  Priorizado por reglas transparentes: severidad primero, impacto económico después. Sin login, sin
                  automatizar conversaciones sensibles.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  onClick={() => exportDonorsForImport(sortedDonors)}
                >
                  <Download />
                  Exportar
                </Button>
                <Button variant="ghost" size="sm" className="text-white/75 hover:bg-white/10 hover:text-white" onClick={restartDemo}>
                  <RotateCcw />
                  Reiniciar
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroStat label="Riesgo crítico mensual" value={formatCurrency(metrics.criticalMonthlyAtRisk)} />
              <HeroStat label="Anualizado en juego" value={formatCurrency(metrics.criticalAnnualAtRisk)} />
              <HeroStat label="Ingreso preservado" value={formatCurrency(metrics.monthlyRecovered)} />
            </div>
          </div>

          <div className="border-t border-border bg-card p-5 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
              <TriangleAlert className="size-4" />
              Atender primero
            </div>
            {nextDonor ? (
              <div className="mt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">{nextDonor.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{getDonorRisk(nextDonor).reasons[0]}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-right text-red-800 ring-1 ring-red-200">
                    <p className="text-lg font-semibold">{formatCurrency(nextDonor.monthlyAmount)}</p>
                    <p className="text-xs">mensual</p>
                  </div>
                </div>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/donor/${nextDonor.id}`}>
                    Abrir caso
                    <ArrowRight />
                  </Link>
                </Button>
                <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
                  <div className="rounded-lg border border-border bg-secondary/60 p-3">
                    <p className="font-semibold text-foreground">Por qué está arriba</p>
                    <p className="mt-1 leading-5">Pago rechazado activo y mayor aporte mensual en la cola.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/60 p-3">
                    <p className="font-semibold text-foreground">Cierre esperado</p>
                    <p className="mt-1 leading-5">Registrar recuperado o seguimiento para recalcular el riesgo.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-accent p-4 text-sm text-accent-foreground">
                No hay casos activos para atender.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Reglas determinísticas, editables por la persona de la ONG.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportDonorsForImport(sortedDonors)}>
            <Download />
            Exportar Excel
          </Button>
          <Button variant="ghost" size="sm" onClick={restartDemo}>
            Reiniciar demo
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard value={String(metrics.totalDonors)} label="Donantes cargados" />
        <MetricCard
          value={String(metrics.criticalRiskCount)}
          label="Pagos rechazados prioritarios"
          tone="danger"
        />
        <MetricCard
          value={formatCurrency(metrics.criticalMonthlyAtRisk)}
          label="Mensuales en riesgo crítico"
          tone="danger"
        />
        <MetricCard
          value={formatCurrency(metrics.criticalAnnualAtRisk)}
          label="Anualizados en juego"
          tone="warning"
        />
        <MetricCard
          value={formatCurrency(metrics.monthlyRecovered)}
          label="Recuperados"
          detail={`${formatCurrency(metrics.annualRecovered)} anualizados`}
          tone="success"
        />
        <MetricCard
          value={String(metrics.additionalFollowUpCount)}
          label="Casos adicionales requieren seguimiento"
        />
      </section>

      <section className="space-y-3" aria-label="Vistas de trabajo">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Qué revisar ahora</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Elegí una vista de trabajo. La prioridad siempre sale de reglas simples, no de IA.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
            <HeartHandshake className="size-4" />
            {formatCurrency(metrics.annualRecovered)} anualizados preservados
          </div>
        </div>
        <div className="grid gap-2 rounded-lg border border-border bg-card/92 p-1.5 shadow-sm md:grid-cols-4">
          {queueViews.map((item) => {
            const active = view === item.key;
            const count = sortedDonors.filter((donor) => matchesView(donor, item.key)).length;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                aria-pressed={active}
                className={
                  active
                    ? "rounded-lg border border-primary/20 bg-accent/85 p-3 text-left shadow-xs"
                    : "rounded-lg border border-transparent p-3 text-left transition-colors hover:bg-secondary/75"
                }
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  <span className={active ? "text-lg font-semibold text-primary" : "text-lg font-semibold text-foreground"}>
                    {count}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <DonorTable donors={visibleDonors} title={selectedView.label} description={selectedView.description} />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.10] p-4 ring-1 ring-white/12 backdrop-blur">
      <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-white/58">{label}</p>
    </div>
  );
}

function matchesView(donor: Donor, view: QueueView) {
  const flags = getRiskFlags(donor);
  const isResolved = donor.followUpStatus === "recovered" || donor.followUpStatus === "cancelled";
  const hasFollowUpRisk =
    !isResolved &&
    !flags.failedPayment &&
    (flags.pendingPayment || flags.passiveChurn || flags.staleAmount || flags.staleImpact || flags.invalidPhone);

  if (view === "priority") {
    return (!isResolved && flags.failedPayment) || hasFollowUpRisk;
  }

  if (view === "failed") {
    return !isResolved && flags.failedPayment;
  }

  if (view === "follow_up") {
    return hasFollowUpRisk;
  }

  return isResolved;
}
