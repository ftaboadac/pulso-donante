# Datos de demo — `donantes-demo.csv`

Archivo pensado para la demo en vivo. Simula el **export real de una ONG**: encabezados "desprolijos" en español, para lucir el paso de onboarding (**emparejá tus columnas**).

## Cómo abrirlo como Excel
El `.csv` se abre directo en Excel / Google Sheets. Si te lo piden en `.xlsx`, abrilo y "Guardar como → Libro de Excel".

## Resumen de la base (30 donantes)

| Estado | Cantidad | Quiénes |
|---|---|---|
| ✅ Sanos | 10 | Aportan estable o creciente, último cobro Aprobado |
| 🔴 Débito rechazado | 8 | "Estado Último Cobro" = Rechazado |
| 🟠 En caída | 6 | Monto desciende Feb→May |
| 🟡 Dormidos | 6 | Sin aportes hace 3+ meses (columnas vacías) |
| **Total de riesgo** | **20** | |

> Número lindo para el dashboard: **"20 donantes de riesgo de 30"**.

## Detalle por categoría (para validar la lógica de los devs)

**🔴 Débito rechazado (8):** Gabriela Méndez, Pablo Castro, Verónica Ramírez, Federico Ríos, Mariana Acosta, Hernán Vega, Silvina Herrera, Cristian Ledesma.

**🟠 En caída (6):** Andrea Ojeda, Marcelo Quiroga, Patricia Molina, Leonardo Cabrera, Romina Figueroa, Walter Benítez.

**🟡 Dormidos (6):** Estela Domínguez, Raúl Medina, Claudia Sánchez, Néstor Ibáñez, Sandra Paz, Alejandro Coria.

## Estrellas de la demo (los que conviene mostrar en vivo)

- **Gabriela Méndez** → caso 🔴 "débito rechazado", tarjeta de crédito vencida. Ideal para mostrar el mensaje de "actualizá tu medio de pago".
- **Andrea Ojeda** → caso 🟠 "en caída", venía de $8.000 y bajó a $3.000. Ideal para el mensaje de "reconectar con el impacto".
- **Néstor Ibáñez** → caso 🟡 "dormido", último aporte hace 8 meses. Ideal para el mensaje de "te extrañamos / novedades".

> Hoy es **junio 2026** en la demo, así que "hace 3+ meses" = último aporte anterior a marzo 2026.
