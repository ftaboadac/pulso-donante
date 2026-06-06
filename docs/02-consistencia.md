# Pulso Donante — Guía de consistencia

> Tu rol acá: que **todos digamos lo mismo, igual, en todos lados** (app, pitch, deck, demo). La consistencia es lo que hace que un proyecto se vea "terminado" y profesional ante el jurado. Pasale esta guía a los dos devs.

---

## 1. Nombre del producto

- Se escribe **Pulso Donante** (dos palabras, ambas con mayúscula inicial).
- ❌ Nunca: "PulsoDonante", "pulso donante", "Pulso de Donante", "Donor Pulse".
- Tagline corto: **"Cuidá a los donantes que ya tenés."**
- Una línea (para deck/landing): *Pulso Donante detecta a los donantes en riesgo y te ayuda a recuperarlos por WhatsApp, en minutos.*

---

## 2. Glosario (decir esto, no aquello)

| ✅ Usar | ❌ Evitar | Por qué |
|---|---|---|
| **Donante** | socio, cliente, usuario, aportante | "Donante" es cálido y correcto para una ONG. |
| **Usuario/a de la ONG** (o "el equipo de la ONG") | admin, operador | Es quien usa la app, no el donante. |
| **Donante de riesgo** | cliente churn, moroso, deudor | "Moroso/deudor" suena a banco y ofende. |
| **Débito rechazado** | pago fallido, impago, mora | Término claro y sin culpa. |
| **En caída** | donante decreciente, downgrade | Simple y humano. |
| **Dormido** | inactivo, perdido, baja | "Perdido" da por muerto algo recuperable. |
| **Aporte / donación** | pago, cobro (salvo "estado del cobro") | Es una donación, no una factura. |
| **Recuperar / reconectar** | reactivar, retener | Lenguaje de vínculo, no de métrica fría. |
| **Mensaje** | notificación, comunicación | Es un mensaje de persona a persona. |

> Regla de oro: hablamos **del lado del donante como alguien valioso**, no como un número que se cae.

---

## 3. Tono de voz

- **Cercano, argentino, de "vos".** Cálido pero respetuoso.
- Frases cortas. Sin jerga técnica ni corporativa.
- Empatía primero, pedido después. Nunca culpar al donante.
- Emojis: con moderación y solo en los mensajes de WhatsApp (no en la UI de la app).

**Ejemplo de tono correcto (mensaje):**
> "Hola Ana, ¡gracias por bancar a los chicos todos estos meses! 💛 Vimos que el último débito no pudo procesarse. ¿Querés que te pasemos el link para actualizar el medio de pago?"

**Tono incorrecto:**
> "Estimado cliente, registramos un impago en su cuenta. Regularice su situación a la brevedad."

---

## 4. Naming de pantallas y botones (que sea igual en la app y en la demo)

| Pantalla / elemento | Texto exacto |
|---|---|
| Acción de inicio | **Subir Excel de donantes** |
| Paso de mapeo | **Emparejá tus columnas** |
| Vista principal | **Dashboard** |
| Sección de riesgo | **Donantes de riesgo** |
| Filtros de riesgo | **Débito rechazado** · **En caída** · **Dormido** |
| Acción IA | **Generar mensaje** |
| Acción de envío | **Enviar por WhatsApp** |
| Estado de seguimiento | **Sin contactar** → **Contactado** → **Respondió** → **Recuperado** |

> Tip para el dev de front: si una etiqueta de botón no está en esta tabla, preguntá antes de inventar una nueva.

---

## 5. Campos canónicos (los que la app entiende)

Esto define el **onboarding** (emparejar columnas). El Excel de la ONG puede tener cualquier encabezado; lo mapeamos a estos campos:

| Campo canónico | Qué es | Ejemplos de cómo viene en el Excel real |
|---|---|---|
| `nombre_completo` | Nombre del donante | "Nombre y Apellido", "Socio", "Donante" |
| `telefono` | Celular (para WhatsApp) | "Celular", "Tel", "WhatsApp" |
| `email` | Correo | "Mail", "Email", "Correo" |
| `metodo_pago` | Cómo aporta | "Medio de Pago", "Forma de Pago" |
| `historial_aportes` | Montos por mes | "Aporte Feb-26", "Donación Marzo"... |
| `estado_ultimo_cobro` | Aprobado / Rechazado | "Estado Último Cobro", "Resultado" |
| `fecha_ultimo_aporte` | Última donación | "Último Aporte", "Fecha último pago" |

---

## 6. Paleta y marca (sugerencia simple, no obligatoria)

- **Color principal:** un verde/teal cálido (salud, "pulso", vida). Ej: `#0E9F8E`.
- **Acentos de riesgo:** 🔴 rojo (`#E5484D`) · 🟠 naranja (`#F76808`) · 🟡 amarillo (`#F5D90A`).
- **Logo conceptual:** un latido (línea de pulso) que termina en un corazón. Une "pulso" + "donar".
- Tipografía: la que ya trae el starter (Geist) está perfecta, no la cambien.
