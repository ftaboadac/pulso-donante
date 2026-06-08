# Pulso Donante

Pulso Donante convierte una planilla de donantes en una cola priorizada de acciones por WhatsApp. Ayuda a una ONG a detectar pagos rechazados y otros riesgos a tiempo, preparar mensajes cuidados y medir cuánto ingreso logró preservar.

> Pulso Donante no reemplaza el vínculo humano. Automatiza la detección, priorización y preparación; una persona revisa, decide y envía.

## Contexto

Este proyecto nació como MVP para una hackathon orientada a organizaciones sociales. El objetivo fue prototipar, en poco tiempo, una herramienta simple para que una ONG pueda detectar donantes en riesgo, priorizar seguimientos y preparar mensajes de contacto sin automatizar conversaciones sensibles.

## Problema

Muchas ONGs gestionan sus donantes entre Excel, correo y WhatsApp. Los pagos fallidos, montos desactualizados y seguimientos pendientes se detectan tarde, por lo que parte de las bajas ocurre de forma pasiva y evitable.

El MVP responde dos preguntas:

1. ¿Cuánto ingreso está por perder la organización?
2. ¿Qué casos debería atender hoy?

## Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Home y entrada a la demo |
| `/onboarding` | Vista previa, mapeo y normalización de la planilla |
| `/dashboard` | Métricas y cola priorizada de donantes |
| `/donor/[id]` | Diagnóstico, mensaje, WhatsApp y seguimiento |

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

## Uso de IA en el MVP

Pulso Donante usa IA de forma acotada y supervisada. No reemplaza a la persona de la ONG, no decide qué donantes están en riesgo y no envía mensajes automáticamente. Su función es reducir fricción operativa en dos momentos específicos.

### Mapeo asistido de la planilla

Cada ONG organiza su Excel de forma distinta. La app puede analizar las columnas detectadas y algunas filas de ejemplo para sugerir un mapeo inicial hacia el modelo interno. Por ejemplo:

- `Donante` → nombre.
- `Celular / WhatsApp` → teléfono.
- `Aporte actual` → monto mensual.
- `Estado último cobro` → estado de pago.

También puede sugerir cómo interpretar valores frecuentes como `OK`, `Rechazado`, `Sin fondos` o `Pendiente`.

Al abrir el onboarding, Claude Sonnet 4.6 analiza automáticamente las siete columnas y hasta cinco filas de ejemplo. La sugerencia nunca se aplica de forma automática: la persona debe verla, confirmarla o corregirla antes de que la app procese la base. La selección confirmada queda guardada durante la sesión.

Si Claude no está disponible, el onboarding continúa con heurísticas simples y un mapeo preseleccionado. La pantalla identifica claramente si la propuesta fue generada por Claude o por el fallback local.

### Redacción asistida de mensajes

A partir del nombre, monto mensual, causa apoyada, motivo de riesgo e impacto concreto, “Generar con Claude” prepara un borrador con tono cuidado. La persona puede editarlo, volver al template original y decidir si lo copia o abre WhatsApp mediante `wa.me`.

El template seguro siempre aparece primero. Si la IA falla o devuelve contenido inválido, el texto actual no se reemplaza y el flujo principal continúa funcionando.

### Límites

La IA:

- No clasifica pagos como definitivos.
- No calcula riesgo financiero ni decide prioridades.
- No envía mensajes.
- No solicita tarjeta, CBU ni información bancaria.
- No aplica mapeos sin confirmación humana.

Las reglas de riesgo siguen siendo determinísticas, transparentes y auditables.

```text
Planilla -> IA sugiere mapeo -> persona confirma
         -> reglas determinísticas detectan riesgo
         -> IA sugiere mensaje -> persona revisa y envía por WhatsApp
         -> persona registra resultado -> dashboard recalcula métricas
```

Para el MVP, la API de IA está administrada por la plataforma. La ONG no necesita configurar una API key, crear una cuenta de OpenAI o Anthropic ni realizar integraciones técnicas.

La automatización completa queda como una evolución futura únicamente para mensajes de bajo riesgo y con aprobación previa de la organización.

## Stack

- Next.js App Router
- React y TypeScript
- Tailwind CSS
- Componentes estilo shadcn/ui
- Claude Sonnet 4.6 mediante el SDK oficial de Anthropic
- `localStorage` para persistencia de la demo
- Enlaces `wa.me` para abrir WhatsApp
- Vercel como destino de despliegue

El loop principal no necesita base de datos, autenticación ni variables de entorno. Las funciones de Claude requieren `ANTHROPIC_API_KEY`, pero tienen fallback local y nunca bloquean la demo.
