import type { Donor } from "@/types/donor";

export type DonorRisk = {
  level: "critical" | "follow_up" | "ok";
  reasons: string[];
  score: number;
};

const TODAY = new Date("2026-06-06T12:00:00");
const INACTIVE_STATUSES = new Set(["recovered", "cancelled"]);

export function daysSince(date: string) {
  return Math.floor((TODAY.getTime() - new Date(`${date}T12:00:00`).getTime()) / 86_400_000);
}

export function getRiskReasons(donor: Donor) {
  const reasons: string[] = [];
  const paymentDays = daysSince(donor.lastPaymentDate);
  const amountUpdateDays = daysSince(donor.lastAmountUpdateDate);
  const impactContactDays = daysSince(donor.lastImpactContactDate);

  if (donor.paymentStatus === "failed") {
    reasons.push(`Pago rechazado hace ${paymentDays} días`);
  } else if (donor.paymentStatus === "pending") {
    reasons.push("Pago pendiente");
  } else if (paymentDays > 45) {
    reasons.push(`Último pago hace ${paymentDays} días: posible baja pasiva`);
  }

  if (amountUpdateDays > 120) {
    reasons.push(`Monto sin actualizar hace ${amountUpdateDays} días`);
  }

  if (impactContactDays > 60) {
    reasons.push(`Sin rendición de impacto hace ${impactContactDays} días`);
  }

  if (!/^\+\d{10,15}$/.test(donor.phone)) {
    reasons.push("Teléfono inválido: no contactable");
  }

  return reasons;
}

export function getPriority(donor: Donor) {
  if (INACTIVE_STATUSES.has(donor.followUpStatus)) {
    return 0;
  }

  if (donor.paymentStatus === "failed") {
    return 2_000_000 + donor.monthlyAmount;
  }

  return getRiskReasons(donor).length > 0 ? 1_000_000 + donor.monthlyAmount : donor.monthlyAmount;
}

export function getDonorRisk(donor: Donor): DonorRisk {
  if (INACTIVE_STATUSES.has(donor.followUpStatus)) {
    return { level: "ok", reasons: [], score: 0 };
  }

  const reasons = getRiskReasons(donor);

  return {
    level: donor.paymentStatus === "failed" ? "critical" : reasons.length > 0 ? "follow_up" : "ok",
    reasons,
    score: getPriority(donor),
  };
}

export function sortDonorsByPriority(donors: Donor[]) {
  return [...donors].sort((a, b) => getPriority(b) - getPriority(a));
}
