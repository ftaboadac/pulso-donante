# Pulso Donante

Pulso Donante convierte una planilla de donantes en una cola priorizada de acciones por WhatsApp. Ayuda a una ONG a detectar pagos rechazados y otros riesgos a tiempo, preparar mensajes cuidados y medir cuánto ingreso logró preservar.

> Pulso Donante no reemplaza el vínculo humano. Automatiza la detección, priorización y preparación; una persona revisa, decide y envía.

## Problema

Muchas ONGs gestionan sus donantes entre Excel, correo y WhatsApp. Los pagos fallidos, montos desactualizados y seguimientos pendientes se detectan tarde, por lo que parte de las bajas ocurre de forma pasiva y evitable.

El MVP responde dos preguntas:

1. ¿Cuánto ingreso está por perder la organización?
2. ¿Qué casos debería atender hoy?

## Flujo del MVP

1. La persona inicia una demo sin login.
2. Revisa una planilla precargada.
3. Confirma el mapeo de columnas y la normalización de estados.
4. Ve métricas y una cola de donantes ordenada por prioridad.
5. Abre el detalle de un donante y entiende el motivo del riesgo.
6. Revisa y edita un mensaje sugerido.
7. Abre WhatsApp mediante un enlace `wa.me` o copia el mensaje.
8. Registra el resultado del contacto.
9. El dashboard recalcula el ingreso recuperado.

## Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Home y entrada a la demo |
| `/onboarding` | Vista previa, mapeo y normalización de la planilla |
| `/dashboard` | Métricas y cola priorizada de donantes |
| `/donor/[id]` | Diagnóstico, mensaje, WhatsApp y seguimiento |

## Datos de la demo

La base incluye 10 donantes:

- 4 pagos rechazados prioritarios.
- `$34.500` mensuales en riesgo crítico.
- `$414.000` anualizados en riesgo crítico.
- 3 casos adicionales de seguimiento.
- `$0` recuperados al iniciar.

El caso principal es María Gómez, con un aporte de `$5.000` mensuales. Al marcarla como recuperada, el dashboard debe mostrar `$5.000` mensuales y `$60.000` anualizados preservados.

## Contrato de datos

```ts
type Donor = {
  id: string;
  name: string;
  phone: string;
  monthlyAmount: number;
  paymentStatus: "paid" | "failed" | "pending" | "unknown";
  lastPaymentDate: string;
  lastAmountUpdateDate: string;
  lastImpactContactDate: string;
  cause: string;
  impactText: string;
  followUpStatus:
    | "pending"
    | "contacted"
    | "recovered"
    | "wants_increase"
    | "needs_follow_up"
    | "cancelled";
};
```

La definición fuente está en `types/donor.ts`.

## Reglas de riesgo

Las reglas son determinísticas, visibles y auditables:

- Pago rechazado: riesgo crítico.
- Último pago hace más de 45 días: posible baja pasiva.
- Monto sin actualizar hace más de 120 días: seguimiento.
- Último contacto de impacto hace más de 60 días: seguimiento.
- Teléfono faltante o inválido: no contactable por WhatsApp.
- A igual severidad, un mayor aporte mensual sube la prioridad.
- Un caso recuperado o cancelado deja de sumar al riesgo activo.

La IA, si se incorpora, solo puede asistir con la redacción. No debe clasificar pagos, decidir el riesgo ni enviar mensajes.

## Stack

- Next.js App Router
- React y TypeScript
- Tailwind CSS
- Componentes estilo shadcn/ui
- `localStorage` para persistencia de la demo
- Enlaces `wa.me` para abrir WhatsApp
- Vercel como destino de despliegue

El MVP no necesita base de datos, autenticación ni variables de entorno para funcionar.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Antes de entregar:

```bash
npm run lint
npm run build
```

## Estructura relevante

```text
app/
  page.tsx                    Home
  (app)/onboarding/page.tsx  Demo de planilla
  (app)/dashboard/page.tsx   Métricas y tabla
  (app)/donor/[id]/page.tsx  Detalle del donante
components/
  donor-dashboard.tsx
  donor-detail.tsx
  onboarding-demo.tsx
hooks/
  use-donors.ts              Estado y persistencia local
lib/
  donors.ts                  Seed, reglas, métricas y mensajes
types/
  donor.ts                   Contrato de datos
```

## Fuera de alcance

- Envío automático de mensajes.
- WhatsApp Business API, Twilio o bots.
- Cobros reales o actualización de tarjeta/CBU.
- Almacenamiento de datos financieros sensibles.
- CRM completo, roles, permisos o soporte multi-ONG.
- Importador universal de cualquier Excel.
- Chatbot autónomo o IA tomando decisiones.
- Aplicación móvil nativa.

## Definition of Done

- El enlace abre sin login y permite recorrer la demo.
- El onboarding muestra mapeo y normalización.
- El dashboard separa pagos rechazados de otros seguimientos.
- Existe al menos un pago rechazado y un monto desactualizado.
- El mensaje incluye nombre, motivo, impacto y una acción concreta.
- El botón de WhatsApp abre `wa.me` con texto precargado.
- Copiar mensaje funciona como alternativa.
- Marcar un caso como recuperado actualiza las métricas.
- La experiencia funciona en celular y navegador incógnito.
- No se solicitan ni almacenan datos financieros sensibles.

## Principio de alcance

Si una funcionalidad no ayuda a recuperar un donante durante la demo, no bloquea el MVP. Si el flujo no se entiende al abrir el enlace en menos de 60 segundos, debe simplificarse.
