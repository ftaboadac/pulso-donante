# Agent Notes

Pulso Donante es un MVP para una hackathon de un día. Optimizar siempre por una demo clara, funcional y desplegable.

## Tesis de producto

Pulso Donante no reemplaza el vínculo humano con donantes. Evita que la ONG llegue tarde.

La aplicación:

- Detecta riesgos mediante reglas determinísticas.
- Prioriza casos por severidad e impacto económico.
- Sugiere mensajes editables.
- Abre WhatsApp con texto precargado.
- Registra seguimiento y calcula ingreso preservado.

La persona de la ONG revisa, decide y envía. Nunca automatizar conversaciones sensibles.

## Loop prioritario

Mantener funcionando de punta a punta:

```text
seed -> dashboard -> detalle -> mensaje editable -> wa.me
     -> marcar recuperado -> dashboard recalculado
```

Onboarding, exportación, persistencia remota e IA son secundarios frente a este loop.

## Rutas mínimas

- `/`: Home con acceso inmediato a la demo.
- `/onboarding`: planilla precargada, mapeo y normalización.
- `/dashboard`: métricas y tabla priorizada.
- `/donor/[id]`: diagnóstico, mensaje, WhatsApp y seguimiento.

No agregar login al flujo principal.

## Contrato de datos

La fuente de verdad es `types/donor.ts`:

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

No renombrar campos ni ampliar estados sin actualizar tipos, seed, reglas, UI y README juntos.

## Seed obligatorio

La demo debe conservar estas métricas iniciales:

- 10 donantes cargados.
- 4 pagos rechazados prioritarios.
- `$34.500` mensuales en riesgo crítico.
- `$414.000` anualizados en riesgo crítico.
- 3 casos adicionales de seguimiento.
- `$0` recuperados inicialmente.

María Gómez debe aportar `$5.000` mensuales. Al marcarla como recuperada, las métricas deben sumar `$5.000` mensuales y `$60.000` anualizados preservados.

## Reglas de negocio

Implementar reglas directas y comprobables:

- `paymentStatus === "failed"`: riesgo crítico.
- Último pago mayor a 45 días: posible baja pasiva.
- Última actualización de monto mayor a 120 días: seguimiento.
- Último contacto de impacto mayor a 60 días: seguimiento.
- Teléfono inválido: riesgo operativo.
- Mayor severidad y mayor aporte mensual aumentan la prioridad.
- `recovered` y `cancelled` dejan de sumar al riesgo activo.

No usar un LLM para clasificar riesgo, pagos o prioridades.

## Uso de IA en el MVP

La IA es opcional, acotada y supervisada. Solo puede reducir fricción en dos puntos:

1. Sugerir el mapeo inicial de columnas y la normalización de estados durante el onboarding.
2. Generar un borrador editable de mensaje a partir de nombre, monto, causa, motivo de riesgo e impacto.

Flujo permitido:

```text
Planilla -> IA sugiere mapeo -> persona confirma
         -> reglas determinísticas detectan riesgo
         -> IA sugiere mensaje -> persona revisa y envía por WhatsApp
         -> persona registra resultado -> dashboard recalcula métricas
```

Reglas obligatorias:

- Nunca aplicar un mapeo sugerido sin confirmación humana.
- Mostrar la sugerencia de IA como editable y corregible.
- Invocar Claude una sola vez por sesión al entrar al onboarding y cachear el resultado en `sessionStorage`.
- Mantener heurísticas simples de mapeo como fallback.
- Mantener templates de mensajes como fallback.
- Mantener visible el template hasta que Claude devuelva un borrador válido.
- Si la IA falla, el loop prioritario debe seguir funcionando.
- No pedir a la ONG una API key ni una cuenta de OpenAI o Anthropic.
- Para el MVP, asumir que la API de IA es administrada por la plataforma.
- No usar IA para clasificar pagos, calcular riesgo financiero o decidir prioridades.
- No permitir que la IA envíe mensajes o inicie conversaciones.
- No solicitar tarjeta, CBU ni información bancaria mediante prompts o mensajes.

La automatización futura solo puede considerarse para mensajes de bajo riesgo y con aprobación previa de la organización. No forma parte del MVP.

## Arquitectura

- Mantener todo dentro de la aplicación Next.js.
- Preferir Server Components para lecturas estáticas.
- Usar Client Components solo para filtros, edición, copia, WhatsApp y estado local.
- Para la demo, usar seed local y `localStorage`.
- Preferir Server Actions para mutaciones simples si se agrega persistencia.
- Usar API routes solo para integraciones externas, uploads, webhooks o IA.
- Mantener clientes de SDK lazy para que `next build` funcione sin variables.
- Usar `ANTHROPIC_API_KEY` solo en servidor y `ANTHROPIC_MODEL=claude-sonnet-4-6` por defecto.
- Validar entradas y salidas de IA con `zod`; usar structured outputs para el mapeo.
- No registrar prompts, nombres, teléfonos ni mensajes. Solo operación, resultado, latencia y request ID.
- No agregar backend separado, Docker, colas, Redis ni microservicios.
- No agregar Supabase hasta que la persistencia sea una necesidad explícita.

## Ubicación del código

- `app/`: rutas, layouts, Server Actions y API routes.
- `components/`: componentes de producto reutilizables.
- `components/ui/`: primitivas de interfaz.
- `hooks/use-donors.ts`: estado y persistencia de la demo.
- `lib/donors.ts`: seed, reglas, métricas, mensajes y enlaces.
- `lib/anthropic.ts`: cliente lazy de Anthropic, exclusivamente server-only.
- `types/ai.ts`: contratos compartidos para los endpoints de IA.
- `types/donor.ts`: contrato compartido.
- `supabase/schema.sql`: esquema futuro, solo si se adopta Supabase.

## UX y contenido

- Escribir toda la experiencia visible en español.
- Hacer evidente qué caso atender primero y por qué.
- Diferenciar riesgo crítico por pago rechazado de riesgo general de churn.
- Mostrar valores mensuales y anualizados.
- Explicar las reglas sin lenguaje técnico.
- Mantener el mensaje editable antes de abrir WhatsApp.
- Ofrecer “Copiar mensaje” como alternativa.
- Diseñar primero para una demo de 2 minutos y uso móvil.
- Evitar texto largo, pantallas decorativas y funciones sin papel en el flujo.

## Seguridad y límites

- No enviar mensajes automáticamente.
- No pedir ni guardar tarjeta, CBU u otros datos financieros sensibles.
- No implementar cobros reales dentro del MVP.
- Los enlaces de actualización de pago deben pertenecer a la ONG o a un proveedor seguro.
- No prometer importar cualquier Excel; demostrar mapeo asistido con una planilla realista.
- No presentar la herramienta como capaz de eliminar todo el churn.

## Fuera de alcance

- WhatsApp Business API, Twilio y bots.
- CRM completo, roles, permisos y multi-ONG.
- Chatbot autónomo.
- Aplicación automática de mapeos sugeridos por IA.
- Envío automático de mensajes generados por IA.
- Importador universal de Excel.
- Aplicación móvil nativa.
- Reportes avanzados o automatizaciones de alto riesgo.

## Convenciones

- Mantener funciones pequeñas, tipadas y legibles.
- Preferir lógica directa a abstracciones genéricas.
- Validar inputs de API con `zod`.
- Reutilizar componentes y tokens existentes.
- No hacer refactors ajenos al MVP.
- Si se cambia una tabla persistida, actualizar tipos, esquema SQL y README juntos.

## Verificación

Antes del handoff:

```bash
npm run lint
npm run build
```

También verificar manualmente:

1. `/` abre sin login.
2. El onboarding llega al dashboard.
3. Las métricas iniciales coinciden con el seed.
4. El detalle de María genera un mensaje editable.
5. `wa.me` contiene teléfono y mensaje codificados.
6. Copiar mensaje funciona.
7. Marcar recuperado recalcula el dashboard.
8. El flujo funciona en viewport móvil.

## Regla final

Si no ayuda a recuperar un donante durante la demo, no debe bloquear el MVP. Si el jurado no lo entiende en menos de 60 segundos, simplificar.
