# Pulso Donante — Caso de uso

> Documento dueño: rol de producto/narrativa. Define **qué problema resolvemos, para quién y por qué importa**. Todo el resto (pitch, demo, copy) se apoya en esto.

---

## 1. La ONG de la demo (ficticia)

**Fundación Manos que Abrazan**

- Sostiene 3 comedores comunitarios y un programa de apoyo escolar para **480 chicos** en el conurbano bonaerense.
- Se financia casi 100% con **donantes mensuales** (débito automático y tarjeta de crédito).
- Tiene **1.250 donantes activos**, con una donación promedio de **$4.800/mes**.
- Equipo chico: 6 personas. **Nadie tiene tiempo de "perseguir" donantes que dejan de pagar.**

### Persona usuaria

**Lucía, 34 — Coordinadora de Donantes.**
- No es técnica. Vive en Excel y WhatsApp.
- Su jefa le pide "que no se caigan los donantes", pero no tiene herramientas.
- Hoy, cuando rebota un débito, **se entera tarde o no se entera**. Cuando se entera, manda mensajes uno por uno, a mano, sin registro de a quién ya contactó.

---

## 2. El problema (el dolor real)

Las ONG no pierden donantes porque la gente deje de querer ayudar.
**Los pierden por goteo silencioso:**

1. **Débito rechazado** — La tarjeta venció, no había fondos o se dio de baja el CBU. El donante **ni se entera** de que dejó de aportar.
2. **Donante en caída** — Viene bajando el monto mes a mes. Señal temprana de que se está por ir.
3. **Donante dormido** — Hace meses que no aporta y nadie lo notó.

> Dato clave del pitch: en débito automático, **1 de cada 8 cobros rebota cada mes**. Si nadie los contacta, **más de la mitad se pierde para siempre**. Y recuperar a un donante que ya creía en la causa cuesta **mucho menos** que conseguir uno nuevo.

Para Manos que Abrazan, ~150 cobros rebotan por mes. Si se pierde la mitad:
**~75 donantes × $4.800 = $360.000/mes que se van por una grieta que nadie mira (~$4,3M al año).**

---

## 3. La solución

**Pulso Donante** le toma "el pulso" a la base de donantes y le dice a la ONG **a quién hablarle hoy y qué decirle**, sin que tenga que saber de datos ni de tecnología.

Tres pasos:

1. **Subís tu Excel** (el que ya tenés, con los nombres de columna que sea) → la app te ayuda a **emparejar tus columnas** con los campos que necesita (onboarding).
2. **Ves el dashboard** con la salud de tu base y una lista priorizada de **donantes de riesgo**, separados por motivo.
3. **Generás el mensaje** con IA (ya redactado, editable), lo mandás por **WhatsApp** y queda el **registro de seguimiento**.

### Qué NO es (para acotar el alcance en la demo)
- No es un CRM gigante ni un sistema de cobros.
- No procesa pagos ni se conecta al banco.
- Es la **capa de retención**: detecta riesgo + facilita el contacto + deja registro.

---

## 4. Definición de "donante de riesgo" (las 3 categorías)

Estas definiciones son **el corazón del producto**. Usar SIEMPRE estos nombres (ver guía de consistencia).

| Categoría | Cómo se detecta | Acción sugerida |
|---|---|---|
| 🔴 **Débito rechazado** | El último intento de cobro falló (tarjeta vencida / sin fondos / CBU dado de baja). | Avisar para que actualice el medio de pago. Urgente. |
| 🟠 **En caída** | Viene donando cada vez menos (monto descendente 3 meses seguidos). | Reconectar con el impacto, agradecer. |
| 🟡 **Dormido** | No registra aportes hace 3+ meses. | Reenganchar, contar novedades de la causa. |

Un donante sano = aporta de forma estable o creciente y su último cobro fue exitoso.

---

## 5. Flujo de la app (de punta a punta)

```
[Subir Excel] → [Onboarding: emparejar columnas] → [Dashboard de métricas]
      → [Lista de donantes de riesgo (3 categorías)]
      → [Elegir donante] → [Generar mensaje con IA] → [Editar] → [Enviar por WhatsApp]
      → [Registro de seguimiento: contactado / respondió / recuperado]
```

---

## 6. Valor / impacto (lo que decimos al jurado)

- **Para la ONG:** recupera ingresos que ya daba por perdidos, sin sumar personal ni saber de datos.
- **Para el donante:** lo cuidan, no lo pierden por un problema técnico que ni sabía.
- **Para la causa:** más plata sostenida = más chicos que comen.
- **Medible:** "donantes contactados", "recuperados" y "$ recuperados" salen en el dashboard.

**Frase ancla:** *No conseguimos donantes nuevos. Evitamos que se pierdan los que ya tenés.*
