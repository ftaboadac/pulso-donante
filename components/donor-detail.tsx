"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clipboard,
  Clock,
  ExternalLink,
  HeartHandshake,
  LoaderCircle,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  buildDonorMessage,
  buildWaLink,
  followUpStatusLabels,
  formatCurrency,
  getRiskFlags,
  getDonorRisk,
  paymentStatusLabels,
} from "@/lib/donors";
import { daysSince } from "@/lib/risk";
import { useDonors } from "@/hooks/use-donors";
import { generateMessageResponseSchema } from "@/types/ai";
import type { Donor, FollowUpStatus } from "@/types/donor";

const followUpOptions = Object.entries(followUpStatusLabels) as [FollowUpStatus, string][];

export function DonorDetail({ donor: initialDonor }: { donor: Donor }) {
  const { getDonor, updateDonorStatus } = useDonors();
  const donor = getDonor(initialDonor.id) ?? initialDonor;
  const [message, setMessage] = useState(() => buildDonorMessage(initialDonor));
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageSource, setMessageSource] = useState<"template" | "claude">("template");
  const [aiWarning, setAiWarning] = useState("");
  const [copyError, setCopyError] = useState("");

  const risk = getDonorRisk(donor);
  const reasonCards = getReasonCards(donor);
  const annualAmount = donor.monthlyAmount * 12;

  async function copyMessage() {
    setCopyError("");

    try {
      copyWithDocumentFallback(message);
      showCopiedState();
      return;
    } catch {
      // Some browsers disable the legacy copy command but allow the Clipboard API.
    }

    try {
      await copyWithClipboard(message);
      showCopiedState();
    } catch {
      setCopyError("No pudimos copiar automáticamente. Seleccioná el texto del mensaje y copialo manualmente.");
    }
  }

  function showCopiedState() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function generateMessage() {
    setIsGenerating(true);
    setAiWarning("");

    try {
      const response = await fetch("/api/ai/generate-donor-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: donor.id }),
      });
      const payload = generateMessageResponseSchema.parse(await response.json());

      if (!response.ok) {
        throw new Error(payload.warning ?? "No pudimos generar el mensaje.");
      }

      if (payload.source === "claude") {
        setMessage(payload.message);
        setMessageSource("claude");
      } else {
        setAiWarning(payload.warning ?? "La IA no está disponible. Conservamos el mensaje original.");
      }
    } catch {
      setAiWarning("La IA no está disponible. Conservamos el mensaje original.");
    } finally {
      setIsGenerating(false);
    }
  }

  function restoreOriginalMessage() {
    setMessage(buildDonorMessage(donor));
    setMessageSource("template");
    setAiWarning("");
  }

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/dashboard">
          <ArrowLeft />
          Volver a la cola
        </Link>
      </Button>

      <section className="surface-panel overflow-hidden rounded-lg">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="warm-hero p-5 text-white sm:p-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">Caso de cuidado</p>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{donor.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                  Revisá el diagnóstico, ajustá el mensaje y registrá el resultado del contacto.
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.10] px-4 py-3 ring-1 ring-white/12 backdrop-blur">
                <p className="text-xs text-white/58">Severidad</p>
                <p className="mt-1 text-lg font-semibold">
                  {risk.level === "critical" ? "Crítica" : risk.level === "follow_up" ? "Seguimiento" : "Al día"}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <CaseStat label="Aporte mensual" value={formatCurrency(donor.monthlyAmount)} />
              <CaseStat label="Riesgo anual" value={formatCurrency(annualAmount)} />
              <CaseStat label="Causa" value={donor.cause} />
            </div>
          </div>
          <div className="border-t border-border bg-card p-5 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold text-foreground">Próxima acción recomendada</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Abrí WhatsApp con el texto revisado y después registrá el resultado para recalcular el tablero.
            </p>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 shadow-xs">
              <p className="text-xs font-medium uppercase tracking-[0.12em]">Si se recupera</p>
              <p className="mt-1 text-2xl font-semibold">{formatCurrency(donor.monthlyAmount)}</p>
              <p className="text-sm">mensuales preservados</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <Card className={risk.level === "critical" ? "border-red-200" : undefined}>
            <CardHeader>
              <CardTitle>Diagnóstico explicable</CardTitle>
              <CardDescription>Estas reglas determinaron la prioridad del caso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reasonCards.length > 0 ? (
                <div className="space-y-3">
                  {reasonCards.map((item) => (
                    <div key={item.title} className={`rounded-lg border p-4 ${item.cardClassName}`}>
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs ${item.iconClassName}`}
                        >
                          <item.icon className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-accent p-4 text-sm text-accent-foreground">
                  Este vínculo ya no tiene alertas activas.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border bg-secondary/35 p-3">
                  <p className="text-xs text-muted-foreground">Riesgo mensual</p>
                  <p className="mt-1 font-semibold">{formatCurrency(donor.monthlyAmount)}</p>
                </div>
                <div className="rounded-lg border bg-secondary/35 p-3">
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
              <div className="rounded-lg border border-primary/15 bg-accent/70 p-4 text-accent-foreground">
                <p className="text-xs font-medium uppercase tracking-wide">Impacto para contar</p>
                <p className="mt-2 leading-6">{donor.impactText}.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="warm-hero border-b border-white/10 text-white">
              <CardTitle>Contacto y seguimiento</CardTitle>
              <CardDescription className="text-white/68">
                Prepará el mensaje, contactá por WhatsApp y registrá qué pasó con el vínculo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/85 p-4 text-sm text-emerald-950">
                <p className="font-semibold">Próxima acción recomendada</p>
                <p className="mt-1 leading-6">
                  Abrí WhatsApp con el mensaje revisado y, después del contacto, registrá el resultado para actualizar
                  el dashboard.
                </p>
              </div>

              <WorkflowStep
                number="1"
                title="Preparar el mensaje"
                description="La persona de la ONG puede editarlo antes de contactar. La IA solo ayuda a redactar."
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {messageSource === "claude" ? <Sparkles className="size-3.5 text-primary" /> : <ShieldCheck className="size-3.5 text-primary" />}
                    {messageSource === "claude" ? "Borrador sugerido por IA" : "Mensaje base editable"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={generateMessage} disabled={isGenerating}>
                      {isGenerating ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                      {isGenerating ? "Redactando" : "Sugerir con IA"}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={restoreOriginalMessage}>
                      <RotateCcw />
                      Restaurar base
                    </Button>
                  </div>
                </div>

                {aiWarning && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {aiWarning}
                  </p>
                )}

                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="min-h-52 resize-y bg-background leading-6"
                  aria-label="Mensaje sugerido para WhatsApp"
                />
              </WorkflowStep>

              <WorkflowStep
                number="2"
                title="Contactar por WhatsApp"
                description="WhatsApp se abre con texto precargado. La persona revisa y envía manualmente."
              >
                {copyError && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {copyError}
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <a href={buildWaLink(donor, message)} target="_blank" rel="noreferrer">
                      <MessageCircle />
                      Abrir WhatsApp
                      <ExternalLink />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" onClick={copyMessage}>
                    {copied ? <Check /> : <Clipboard />}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  No se envía automáticamente y no se piden tarjeta, CBU ni datos financieros sensibles.
                </div>
              </WorkflowStep>

              <WorkflowStep
                number="3"
                title="Registrar resultado"
                description="Este cambio recalcula las métricas del dashboard."
              >
                <label className="grid gap-2 text-sm font-medium">
                  Estado del vínculo
                  <select
                    value={donor.followUpStatus}
                    onChange={(event) => updateDonorStatus(donor.id, event.target.value as FollowUpStatus)}
                    className="h-11 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                  >
                    {followUpOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs leading-5 text-muted-foreground">{getFollowUpHint(donor.followUpStatus)}</p>

                {donor.followUpStatus !== "recovered" ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4">
                    <p className="text-sm font-semibold text-emerald-950">Si regularizó el aporte</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-900">
                      Marcá recuperado para sumar {formatCurrency(donor.monthlyAmount)} mensuales y{" "}
                      {formatCurrency(annualAmount)} anualizados al ingreso preservado.
                    </p>
                    <Button
                      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => updateDonorStatus(donor.id, "recovered")}
                    >
                      <HeartHandshake />
                      Marcar como recuperado
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-accent p-4 text-sm text-accent-foreground">
                    <p className="font-semibold">Aporte recuperado</p>
                    <p className="mt-1">
                      Sumaste {formatCurrency(donor.monthlyAmount)} mensuales y {formatCurrency(annualAmount)}{" "}
                      anualizados al ingreso preservado.
                    </p>
                  </div>
                )}
              </WorkflowStep>
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
      <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function CaseStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-24 rounded-lg bg-white/[0.10] p-4 ring-1 ring-white/12">
      <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-white/58">{label}</p>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function getFollowUpHint(status: FollowUpStatus) {
  if (status === "pending") {
    return "Todavía no hubo contacto o falta registrar qué pasó.";
  }

  if (status === "contacted") {
    return "Ya hubo contacto, pero el aporte aún no está recuperado.";
  }

  if (status === "recovered") {
    return "El aporte vuelve a contar como ingreso preservado.";
  }

  if (status === "wants_increase") {
    return "La persona mostró interés en aumentar su aporte.";
  }

  if (status === "needs_follow_up") {
    return "Queda una próxima conversación pendiente.";
  }

  return "La persona pidió la baja; el caso deja de sumar al riesgo activo.";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function getReasonCards(donor: Donor) {
  const flags = getRiskFlags(donor);
  const cards: {
    title: string;
    description: string;
    icon: LucideIcon;
    cardClassName: string;
    iconClassName: string;
  }[] = [];

  if (flags.failedPayment) {
    cards.push({
      title: "Pago rechazado",
      description: `El último cobro falló hace ${daysSince(
        donor.lastPaymentDate,
      )} días. Este aporte suma al riesgo crítico hasta que la persona lo regularice o se registre una baja.`,
      icon: WalletCards,
      cardClassName: "border-red-200 bg-red-50/70",
      iconClassName: "bg-white text-red-700",
    });
  } else if (flags.pendingPayment) {
    cards.push({
      title: "Pago pendiente",
      description: "El cobro todavía no está confirmado. Conviene revisar el caso antes de que se convierta en baja.",
      icon: Clock,
      cardClassName: "border-amber-200 bg-amber-50/70",
      iconClassName: "bg-white text-amber-700",
    });
  } else if (flags.passiveChurn) {
    cards.push({
      title: "Posible baja pasiva",
      description: `El último pago fue hace ${daysSince(
        donor.lastPaymentDate,
      )} días. Puede ser un vínculo que se está enfriando sin pedir la baja explícitamente.`,
      icon: TriangleAlert,
      cardClassName: "border-amber-200 bg-amber-50/70",
      iconClassName: "bg-white text-amber-700",
    });
  }

  if (flags.staleAmount) {
    cards.push({
      title: "Monto desactualizado",
      description: `El aporte no se actualiza hace ${daysSince(
        donor.lastAmountUpdateDate,
      )} días. Puede ser buen momento para proponer una actualización cuidada.`,
      icon: WalletCards,
      cardClassName: "border-sky-200 bg-sky-50/70",
      iconClassName: "bg-white text-sky-700",
    });
  }

  if (flags.staleImpact) {
    cards.push({
      title: "Falta contar impacto",
      description: `Pasaron ${daysSince(
        donor.lastImpactContactDate,
      )} días desde el último contacto de impacto. El mensaje debería reconectar el aporte con un resultado concreto.`,
      icon: HeartHandshake,
      cardClassName: "border-teal-200 bg-teal-50/70",
      iconClassName: "bg-white text-teal-700",
    });
  }

  if (flags.invalidPhone) {
    cards.push({
      title: "Teléfono a revisar",
      description: "El número no tiene un formato válido para abrir WhatsApp con seguridad.",
      icon: Phone,
      cardClassName: "border-zinc-200 bg-zinc-50",
      iconClassName: "bg-white text-zinc-700",
    });
  }

  return cards;
}

function copyWithDocumentFallback(message: string) {
  const textarea = document.createElement("textarea");
  textarea.value = message;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command was rejected.");
  }
}

async function copyWithClipboard(message: string) {
  if (!navigator.clipboard || !window.isSecureContext) {
    throw new Error("Clipboard API is unavailable.");
  }

  await Promise.race([
    navigator.clipboard.writeText(message),
    new Promise((_, reject) => window.setTimeout(() => reject(new Error("Clipboard API timed out.")), 700)),
  ]);
}
