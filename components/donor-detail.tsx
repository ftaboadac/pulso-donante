"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clipboard,
  ExternalLink,
  HeartHandshake,
  MessageCircle,
  Phone,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { FollowUpBadge, RiskBadge } from "@/components/donor-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  buildDonorMessage,
  buildWaLink,
  followUpStatusLabels,
  formatCurrency,
  getDonorRisk,
  paymentStatusLabels,
} from "@/lib/donors";
import { useDonors } from "@/hooks/use-donors";
import type { Donor, FollowUpStatus } from "@/types/donor";

const followUpOptions = Object.entries(followUpStatusLabels) as [FollowUpStatus, string][];

export function DonorDetail({ donor: initialDonor }: { donor: Donor }) {
  const { getDonor, updateDonorStatus } = useDonors();
  const donor = getDonor(initialDonor.id) ?? initialDonor;
  const [message, setMessage] = useState(() => buildDonorMessage(initialDonor));
  const [copied, setCopied] = useState(false);

  const risk = getDonorRisk(donor);
  const annualAmount = donor.monthlyAmount * 12;

  async function copyMessage() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/dashboard">
          <ArrowLeft />
          Volver a la cola
        </Link>
      </Button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge donor={donor} />
            <FollowUpBadge donor={donor} />
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{donor.name}</h1>
          <p className="mt-2 text-muted-foreground">{donor.cause}</p>
        </div>
        <div className="rounded-xl border bg-card px-5 py-4 shadow-xs">
          <p className="text-sm text-muted-foreground">Aporte mensual</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(donor.monthlyAmount)}</p>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <Card className={risk.level === "critical" ? "border-red-200" : undefined}>
            <CardHeader>
              <CardTitle>Diagnóstico explicable</CardTitle>
              <CardDescription>Estas reglas determinaron la prioridad del caso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {risk.reasons.length > 0 ? (
                risk.reasons.map((reason) => (
                  <div key={reason} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-white text-primary shadow-xs">
                      <Check className="size-4" />
                    </span>
                    <span className="text-sm font-medium">{reason}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-accent p-4 text-sm text-accent-foreground">
                  Este vínculo ya no tiene alertas activas.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Riesgo mensual</p>
                  <p className="mt-1 font-semibold">{formatCurrency(donor.monthlyAmount)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Riesgo anual</p>
                  <p className="mt-1 font-semibold">{formatCurrency(annualAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contexto del vínculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DetailRow icon={Phone} label="WhatsApp" value={donor.phone} />
              <DetailRow icon={WalletCards} label="Último cobro" value={paymentStatusLabels[donor.paymentStatus]} />
              <DetailRow icon={CalendarDays} label="Fecha del último pago" value={formatDate(donor.lastPaymentDate)} />
              <DetailRow icon={HeartHandshake} label="Último impacto" value={formatDate(donor.lastImpactContactDate)} />
              <div className="rounded-lg bg-primary/5 p-4 text-primary">
                <p className="text-xs font-medium uppercase tracking-wide">Impacto para contar</p>
                <p className="mt-2 leading-6">{donor.impactText}.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" />
                Mensaje sugerido
              </CardTitle>
              <CardDescription>Revisalo y editá el tono antes de abrir WhatsApp. Nunca se envía automáticamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-56 resize-y leading-6"
                aria-label="Mensaje sugerido para WhatsApp"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <a href={buildWaLink(donor, message)} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    Abrir en WhatsApp
                    <ExternalLink />
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={copyMessage}>
                  {copied ? <Check /> : <Clipboard />}
                  {copied ? "Copiado" : "Copiar mensaje"}
                </Button>
              </div>
              <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                No pedimos ni guardamos tarjeta, CBU ni datos financieros sensibles.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registrar seguimiento</CardTitle>
              <CardDescription>El estado actualiza las métricas del dashboard inmediatamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                Estado del vínculo
                <select
                  value={donor.followUpStatus}
                  onChange={(event) => updateDonorStatus(donor.id, event.target.value as FollowUpStatus)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                >
                  {followUpOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {donor.followUpStatus !== "recovered" ? (
                <Button className="w-full" onClick={() => updateDonorStatus(donor.id, "recovered")}>
                  <HeartHandshake />
                  Marcar como recuperado
                </Button>
              ) : (
                <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
                  <p className="font-semibold">¡Aporte recuperado!</p>
                  <p className="mt-1">
                    Sumaste {formatCurrency(donor.monthlyAmount)} mensuales y {formatCurrency(annualAmount)} anualizados
                    al ingreso preservado.
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">El cambio queda guardado en este navegador.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}
