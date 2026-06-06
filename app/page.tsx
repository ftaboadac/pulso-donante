import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: CircleDollarSign,
    title: "Detectá ingresos en riesgo",
    description: "Priorizá pagos rechazados, montos desactualizados y seguimientos pendientes.",
  },
  {
    icon: MessageCircle,
    title: "Llegá con el mensaje correcto",
    description: "Editá una sugerencia cuidada y abrila en WhatsApp con un solo click.",
  },
  {
    icon: HeartHandshake,
    title: "Medí lo que preservás",
    description: "Registrá recuperaciones y mirá su impacto mensual y anual en tiempo real.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-primary">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </span>
          <span className="text-lg">Pulso Donante</span>
        </Link>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Ver dashboard</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 text-sm font-medium text-primary shadow-xs">
            <ShieldCheck className="size-4" />
            Tecnología que cuida el vínculo humano
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Evitá que tu ONG llegue tarde.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Convertí tu planilla de donantes en una cola clara de acciones. Detectá riesgos, prepará mensajes y recuperá
            aportes sin automatizar conversaciones sensibles.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6">
              <Link href="/onboarding">
                Iniciar demo guiada
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <Link href="/dashboard">Explorar con datos demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Sin login. Sin configurar nada. Demo completa en 2 minutos.</p>
        </div>

        <Card className="overflow-hidden border-primary/15 shadow-xl shadow-primary/10">
          <div className="border-b bg-primary px-6 py-5 text-primary-foreground">
            <p className="text-sm text-primary-foreground/70">Pulso de hoy</p>
            <p className="mt-1 text-xl font-semibold">Hay 4 vínculos que necesitan atención</p>
          </div>
          <CardContent className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-destructive/8 p-4">
                <p className="text-sm text-muted-foreground">En riesgo este mes</p>
                <p className="mt-1 text-2xl font-semibold">$34.500</p>
              </div>
              <div className="rounded-xl bg-accent p-4">
                <p className="text-sm text-accent-foreground/70">Impacto anual</p>
                <p className="mt-1 text-2xl font-semibold text-accent-foreground">$414.000</p>
              </div>
            </div>
            <div className="space-y-3">
              {["María Gómez · Pago rechazado", "Valentina Torres · Sin rendición", "Florencia Herrera · Seguimiento"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border bg-background/70 p-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">{item}</span>
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                  </div>
                ),
              )}
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
              <HeartHandshake className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>La app prioriza y sugiere. Una persona revisa, decide y envía.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-y bg-white/65">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border bg-card p-6 shadow-xs">
              <benefit.icon className="size-6 text-primary" />
              <h2 className="mt-5 text-lg font-semibold">{benefit.title}</h2>
              <p className="mt-2 leading-6 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
