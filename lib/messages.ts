import { daysSince } from "@/lib/risk";
import type { Donor } from "@/types/donor";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildDonorMessage(donor: Donor) {
  const firstName = donor.name.split(" ")[0];
  const amount = formatCurrency(donor.monthlyAmount);

  if (donor.paymentStatus === "failed") {
    return `Hola ${firstName}, te escribimos desde Fundación Puente. Este mes no pudimos procesar tu aporte de ${amount}. Tu ayuda sostiene ${donor.cause.toLowerCase()}; con aportes como el tuyo este mes ${donor.impactText}.

¿Querés que te pasemos el link seguro de la organización para actualizar tu medio de pago?
Gracias por seguir cerca.`;
  }

  if (daysSince(donor.lastAmountUpdateDate) > 120) {
    const suggestedAmount = formatCurrency(Math.round((donor.monthlyAmount * 1.3) / 500) * 500);
    return `Hola ${firstName}, gracias por acompañar a Fundación Puente. Tu aporte de ${amount} sigue siendo muy valioso, pero quedó desactualizado frente a los costos actuales. Si podés actualizarlo a ${suggestedAmount}, nos ayudás a sostener ${donor.cause.toLowerCase()}.`;
  }

  return `Hola ${firstName}, queríamos contarte qué hizo posible tu aporte: este mes ${donor.impactText}. Gracias por sostener ${donor.cause.toLowerCase()} y seguir cerca.`;
}
