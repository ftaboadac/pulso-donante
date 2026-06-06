import { DemoStartButton } from "@/components/demo-start-button";
import { Logo } from "@/components/logo";

const features = [
  {
    title: "Importá tu planilla",
    description: "Empezá con el Excel que ya usa tu organización. La app sugiere cómo interpretar cada columna.",
  },
  {
    title: "Detectá riesgo de baja",
    description: "Identificá pagos rechazados, montos desactualizados y vínculos que necesitan seguimiento.",
  },
  {
    title: "Recuperá con criterio humano",
    description: "Priorizá casos y prepará cada contacto sin perder el trato cercano con tus donantes.",
  },
];

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <span className="hidden text-sm text-muted-foreground sm:block">Para organizaciones sociales</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Reducí bajas de donantes desde tu planilla, sin perder el vínculo humano.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Pulso Donante analiza tu base, detecta quiénes necesitan atención y te ayuda a decidir a quién contactar
              primero. Sin integraciones complejas: empezá con la planilla que ya tenés.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <DemoStartButton />
              <span className="text-sm text-muted-foreground">Sin registro · Sin formularios</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm font-medium text-foreground">Resumen de riesgo</span>
              <span className="text-xs text-muted-foreground">Vista previa</span>
            </div>
            <dl className="grid grid-cols-2 gap-4 py-5">
              <div className="rounded-xl bg-red-50 p-4 ring-1 ring-inset ring-red-600/10">
                <dt className="text-xs font-medium text-red-700">En riesgo crítico</dt>
                <dd className="mt-1 text-2xl font-semibold text-red-700">$34.500</dd>
                <dd className="text-xs text-red-700/70">mensuales</dd>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-600/10">
                <dt className="text-xs font-medium text-amber-700">Pagos rechazados</dt>
                <dd className="mt-1 text-2xl font-semibold text-amber-700">4</dd>
                <dd className="text-xs text-amber-700/70">prioritarios</dd>
              </div>
              <div className="col-span-2 rounded-xl bg-secondary p-4">
                <dt className="text-xs font-medium text-muted-foreground">Impacto anualizado en juego</dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">$414.000</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 border-t border-border py-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          Pulso Donante · Herramienta de retención para organizaciones sociales
        </div>
      </footer>
    </div>
  );
}
