"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DonorTable } from "@/components/DonorTable";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { useDonors } from "@/hooks/use-donors";
import {
  formatCurrency,
  getDashboardMetrics,
  getRiskFlags,
  sortDonorsByPriority,
} from "@/lib/donors";
import type { Donor } from "@/types/donor";

type FilterKey = "all" | "failed" | "stale_amount" | "stale_impact";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "failed", label: "Pago rechazado" },
  { key: "stale_amount", label: "Monto desactualizado" },
  { key: "stale_impact", label: "Sin rendición" },
];

export function DonorDashboard() {
  const router = useRouter();
  const { donors, resetDonors } = useDonors();
  const [filter, setFilter] = useState<FilterKey>("all");
  const metrics = getDashboardMetrics(donors);
  const visibleDonors = sortDonorsByPriority(donors).filter((donor) => matchesFilter(donor, filter));

  function restartDemo() {
    resetDonors();
    router.push("/");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Donantes en riesgo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análisis del último ciclo de cobro · priorizado por severidad e impacto
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground ring-1 ring-inset ring-primary/15 sm:inline-flex">
            Análisis completado
          </span>
          <Button variant="ghost" size="sm" onClick={restartDemo}>
            Reiniciar demo
          </Button>
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

      <div className="flex flex-wrap gap-2" aria-label="Filtros de riesgo">
        {filters.map((item) => {
          const active = filter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={
                active
                  ? "rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-primary"
                  : "rounded-full bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-inset ring-border transition-colors hover:text-foreground"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <DonorTable donors={visibleDonors} />
    </div>
  );
}

function matchesFilter(donor: Donor, filter: FilterKey) {
  if (filter === "all") {
    return true;
  }

  const flags = getRiskFlags(donor);

  if (filter === "failed") {
    return flags.failedPayment;
  }

  if (filter === "stale_amount") {
    return flags.staleAmount;
  }

  return flags.staleImpact;
}
