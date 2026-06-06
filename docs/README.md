# Pulso Donante — Material de producto y demo

Esta carpeta es el material "no-código" del proyecto: lo que hace que la demo gane. Mantenido por el rol de producto/narrativa.

## Índice

| Archivo | Qué es | Para qué sirve |
|---|---|---|
| [`01-caso-de-uso.md`](01-caso-de-uso.md) | Problema, solución, valor y flujo | Entender qué hacemos y por qué importa |
| [`02-consistencia.md`](02-consistencia.md) | Nombre, tono, glosario, naming de pantallas | Que todos digamos lo mismo en la app y el pitch |
| [`03-demo-guion.md`](03-demo-guion.md) | Guion de la demo en vivo paso a paso | Presentar la app sin trabarse |
| [`04-pitch.md`](04-pitch.md) | Guion del pitch + deck + Q&A | Hablar 2-3 min y bancar preguntas |
| [`datos-demo/donantes-demo.csv`](datos-demo/donantes-demo.csv) | Excel de prueba (30 donantes) | Cargar en la demo |
| [`datos-demo/README.md`](datos-demo/README.md) | Qué donante cae en qué categoría | Validar la lógica y elegir casos a mostrar |

## Resumen de 1 línea
**Pulso Donante** detecta a los donantes en riesgo (débito rechazado, en caída, dormidos) y ayuda a la ONG a recuperarlos por WhatsApp con un mensaje generado por IA, dejando registro de seguimiento.

## Para los devs
- Campos canónicos y nombres de pantallas/botones: ver `02-consistencia.md`.
- Casos esperados por categoría para validar la lógica de riesgo: ver `datos-demo/README.md`.
