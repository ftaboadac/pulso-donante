"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

import { DonorTable } from "@/components/DonorTable";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { useDonors } from "@/hooks/use-donors";
import { exportDonorsForImport } from "@/lib/donor-export";
import {
  formatCurrency,
  getDashboardMetrics,
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

  function restartDemo() {
    resetDonors();
    router.push("/");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-sm font-medium text-foreground">Base actual</p>
          <p className="text-sm text-muted-foreground">donantes.xlsx</p>
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

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Donantes en riesgo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análisis del último ciclo de cobro · priorizado por severidad e impacto
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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
        <div>
          <h2 className="text-sm font-semibold text-foreground">Qué revisar ahora</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Elegí una vista de trabajo. La prioridad siempre sale de reglas simples, no de IA.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
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
                    ? "rounded-xl border border-primary bg-accent p-4 text-left shadow-xs"
                    : "rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
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
