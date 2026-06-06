import type { Donor } from "@/types/donor";

export type DonorRisk = {
  level: "critical" | "follow_up" | "ok";
  reasons: string[];
  score: number;
};

export type DonorRiskFlags = {
  failedPayment: boolean;
  pendingPayment: boolean;
  passiveChurn: boolean;
  staleAmount: boolean;
  staleImpact: boolean;
  invalidPhone: boolean;
};

const TODAY = new Date("2026-06-06T12:00:00");
const INACTIVE_STATUSES = new Set(["recovered", "cancelled"]);

export function daysSince(date: string) {
  return Math.floor((TODAY.getTime() - new Date(`${date}T12:00:00`).getTime()) / 86_400_000);
}

export function getRiskFlags(donor: Donor): DonorRiskFlags {
  const paymentDays = daysSince(donor.lastPaymentDate);

  return {
    failedPayment: donor.paymentStatus === "failed",
    pendingPayment: donor.paymentStatus === "pending",
    passiveChurn: donor.paymentStatus !== "failed" && donor.paymentStatus !== "pending" && paymentDays > 45,
    staleAmount: daysSince(donor.lastAmountUpdateDate) > 120,
    staleImpact: daysSince(donor.lastImpactContactDate) > 60,
    invalidPhone: !/^\+\d{10,15}$/.test(donor.phone),
  };
}

export function getRiskReasons(donor: Donor) {
  const reasons: string[] = [];
  const paymentDays = daysSince(donor.lastPaymentDate);
  const amountUpdateDays = daysSince(donor.lastAmountUpdateDate);
  const impactContactDays = daysSince(donor.lastImpactContactDate);
  const flags = getRiskFlags(donor);

  if (flags.failedPayment) {
    reasons.push(`Pago rechazado hace ${paymentDays} días`);
  } else if (flags.pendingPayment) {
    reasons.push("Pago pendiente");
  } else if (flags.passiveChurn) {
    reasons.push(`Último pago hace ${paymentDays} días: posible baja pasiva`);
  }

  if (flags.staleAmount) {
    reasons.push(`Monto sin actualizar hace ${amountUpdateDays} días`);
  }

  if (flags.staleImpact) {
    reasons.push(`Sin contacto de impacto hace ${impactContactDays} días`);
  }

  if (flags.invalidPhone) {
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
