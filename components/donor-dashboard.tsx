import Link from "next/link";
import { ArrowRight, CircleAlert, CircleDollarSign, HeartHandshake, TrendingUp, Users } from "lucide-react";

import { RiskBadge } from "@/components/donor-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  demoDonors,
  formatCurrency,
  getDonorMetrics,
  getDonorRisk,
  paymentStatusLabels,
  sortDonorsByPriority,
} from "@/lib/donors";
import { cn } from "@/lib/utils";

export function DonorDashboard() {
  const metrics = getDonorMetrics(demoDonors);
  const visibleDonors = sortDonorsByPriority(demoDonors);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Pulso de hoy</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">¿Qué vínculos necesitan atención?</h1>
          <p className="mt-2 text-muted-foreground">
            Casos ordenados por severidad y aporte mensual. Empezá por los de mayor impacto.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding">Ver planilla demo</Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CircleDollarSign}
          label="En riesgo este mes"
          value={formatCurrency(metrics.criticalMonthlyAmount)}
          detail={`${metrics.criticalCount} pagos rechazados`}
          tone="danger"
        />
        <MetricCard
          icon={TrendingUp}
          label="Riesgo anualizado"
          value={formatCurrency(metrics.criticalAnnualAmount)}
          detail="Si no se recuperan"
        />
        <MetricCard
          icon={Users}
          label="Otros seguimientos"
          value={String(metrics.additionalFollowUpCount)}
          detail="Monto, rendición o pendiente"
        />
        <MetricCard
          icon={HeartHandshake}
          label="Ingreso preservado"
          value={formatCurrency(metrics.recoveredMonthlyAmount)}
          detail={`${formatCurrency(metrics.recoveredAnnualAmount)} anualizados`}
          tone="success"
        />
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          <strong>Foco recomendado:</strong> atendé primero los pagos rechazados. Son los casos más accionables para
          reducir bajas pasivas.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Cola priorizada</h2>
              <p className="mt-1 text-sm text-muted-foreground">{metrics.totalDonors} donantes cargados desde la planilla demo</p>
            </div>
            <p className="text-xs text-muted-foreground">TODO: agregar filtros por tipo de riesgo.</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Donante</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead className="hidden md:table-cell">Motivo</TableHead>
                <TableHead>Estado de pago</TableHead>
                <TableHead className="text-right">Aporte</TableHead>
                <TableHead className="w-12 pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleDonors.map((donor) => {
                const risk = getDonorRisk(donor);
                return (
                  <TableRow key={donor.id} className="group">
                    <TableCell className="pl-5">
                      <Link href={`/donor/${donor.id}`} className="font-medium hover:text-primary">
                        {donor.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{donor.cause}</p>
                    </TableCell>
                    <TableCell>
                      <RiskBadge donor={donor} />
                    </TableCell>
                    <TableCell className="hidden max-w-64 md:table-cell">
                      <span className="line-clamp-1 text-muted-foreground">{risk.reasons.join(" · ") || "Sin alertas"}</span>
                    </TableCell>
                    <TableCell>{paymentStatusLabels[donor.paymentStatus]}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(donor.monthlyAmount)}</TableCell>
                    <TableCell className="pr-5">
                      <Button asChild variant="ghost" size="icon" aria-label={`Abrir detalle de ${donor.name}`}>
                        <Link href={`/donor/${donor.id}`}>
                          <ArrowRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "danger" | "success";
}) {
  return (
    <Card className={cn(tone === "danger" && "border-red-200", tone === "success" && "border-emerald-200")}>
      <CardContent className="p-5">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg bg-secondary text-primary",
            tone === "danger" && "bg-red-50 text-red-700",
            tone === "success" && "bg-emerald-50 text-emerald-700",
          )}
        >
          <Icon className="size-5" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
