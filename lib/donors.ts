import type { Donor, FollowUpStatus, PaymentStatus } from "@/types/donor";

export const demoDonors: Donor[] = [
  {
    id: "maria-gomez",
    name: "María Gómez",
    phone: "+5491155554444",
    monthlyAmount: 5000,
    paymentStatus: "failed",
    lastPaymentDate: "2026-05-30",
    lastAmountUpdateDate: "2025-10-01",
    lastImpactContactDate: "2026-03-03",
    cause: "Salud comunitaria",
    impactText: "38 familias recibieron acompañamiento y controles de salud",
    followUpStatus: "pending",
  },
  {
    id: "laura-martinez",
    name: "Laura Martínez",
    phone: "+5491163214987",
    monthlyAmount: 8000,
    paymentStatus: "failed",
    lastPaymentDate: "2026-05-25",
    lastAmountUpdateDate: "2026-02-15",
    lastImpactContactDate: "2026-04-27",
    cause: "Becas educativas",
    impactText: "12 estudiantes sostuvieron su escolaridad",
    followUpStatus: "pending",
  },
  {
    id: "valentina-torres",
    name: "Valentina Torres",
    phone: "+5491144087632",
    monthlyAmount: 12000,
    paymentStatus: "failed",
    lastPaymentDate: "2026-06-01",
    lastAmountUpdateDate: "2026-01-10",
    lastImpactContactDate: "2026-02-16",
    cause: "Primera infancia",
    impactText: "24 niñas y niños accedieron a espacios de cuidado",
    followUpStatus: "contacted",
  },
  {
    id: "florencia-herrera",
    name: "Florencia Herrera",
    phone: "+5491139042255",
    monthlyAmount: 9500,
    paymentStatus: "failed",
    lastPaymentDate: "2026-05-19",
    lastAmountUpdateDate: "2025-12-20",
    lastImpactContactDate: "2026-03-10",
    cause: "Seguridad alimentaria",
    impactText: "86 viandas nutritivas llegaron a familias del barrio",
    followUpStatus: "needs_follow_up",
  },
  {
    id: "carlos-rodriguez",
    name: "Carlos Rodríguez",
    phone: "+5491169801142",
    monthlyAmount: 3500,
    paymentStatus: "paid",
    lastPaymentDate: "2026-05-07",
    lastAmountUpdateDate: "2026-03-01",
    lastImpactContactDate: "2026-03-23",
    cause: "Inclusión laboral",
    impactText: "9 personas completaron talleres de formación laboral",
    followUpStatus: "pending",
  },
  {
    id: "sebastian-lopez",
    name: "Sebastián López",
    phone: "+5491152078841",
    monthlyAmount: 2000,
    paymentStatus: "paid",
    lastPaymentDate: "2026-05-09",
    lastAmountUpdateDate: "2025-11-15",
    lastImpactContactDate: "2026-05-17",
    cause: "Apoyo escolar",
    impactText: "31 chicos participaron de tutorías semanales",
    followUpStatus: "pending",
  },
  {
    id: "camila-ruiz",
    name: "Camila Ruiz",
    phone: "+5491160027134",
    monthlyAmount: 6000,
    paymentStatus: "pending",
    lastPaymentDate: "2026-05-02",
    lastAmountUpdateDate: "2026-01-20",
    lastImpactContactDate: "2026-04-02",
    cause: "Hábitat",
    impactText: "7 hogares mejoraron sus condiciones de habitabilidad",
    followUpStatus: "pending",
  },
  {
    id: "nicolas-castro",
    name: "Nicolás Castro",
    phone: "+5491140176683",
    monthlyAmount: 2500,
    paymentStatus: "paid",
    lastPaymentDate: "2026-05-15",
    lastAmountUpdateDate: "2026-03-15",
    lastImpactContactDate: "2026-04-12",
    cause: "Ambiente",
    impactText: "120 árboles nativos fueron plantados y cuidados",
    followUpStatus: "pending",
  },
  {
    id: "diego-fernandez",
    name: "Diego Fernández",
    phone: "+5491164489012",
    monthlyAmount: 1500,
    paymentStatus: "paid",
    lastPaymentDate: "2026-05-22",
    lastAmountUpdateDate: "2026-04-10",
    lastImpactContactDate: "2026-05-07",
    cause: "Adultos mayores",
    impactText: "18 personas mayores participaron de encuentros comunitarios",
    followUpStatus: "pending",
  },
  {
    id: "matias-sanchez",
    name: "Matías Sánchez",
    phone: "+5491158820931",
    monthlyAmount: 4000,
    paymentStatus: "paid",
    lastPaymentDate: "2026-05-17",
    lastAmountUpdateDate: "2026-02-20",
    lastImpactContactDate: "2026-05-12",
    cause: "Deporte social",
    impactText: "45 jóvenes sostuvieron actividades deportivas semanales",
    followUpStatus: "pending",
  },
];

export type DonorRisk = {
  level: "critical" | "follow_up" | "ok";
  reasons: string[];
  score: number;
};

export type DonorMetrics = {
  totalDonors: number;
  criticalCount: number;
  criticalMonthlyAmount: number;
  criticalAnnualAmount: number;
  additionalFollowUpCount: number;
  recoveredMonthlyAmount: number;
  recoveredAnnualAmount: number;
};

const TODAY = new Date("2026-06-06T12:00:00");

function daysSince(date: string) {
  return Math.floor((TODAY.getTime() - new Date(`${date}T12:00:00`).getTime()) / 86_400_000);
}

export function getDonorRisk(donor: Donor): DonorRisk {
  if (donor.followUpStatus === "recovered" || donor.followUpStatus === "cancelled") {
    return { level: "ok", reasons: [], score: 0 };
  }

  const reasons: string[] = [];
  let score = 0;

  if (donor.paymentStatus === "failed") {
    reasons.push("Pago rechazado");
    score += 100;
  } else if (donor.paymentStatus === "pending") {
    reasons.push("Pago pendiente");
    score += 45;
  } else if (daysSince(donor.lastPaymentDate) > 45) {
    reasons.push("Posible baja pasiva");
    score += 55;
  }

  if (daysSince(donor.lastAmountUpdateDate) > 120) {
    reasons.push("Monto desactualizado");
    score += 25;
  }

  if (daysSince(donor.lastImpactContactDate) > 60) {
    reasons.push("Sin rendición reciente");
    score += 20;
  }

  if (!/^\+\d{10,15}$/.test(donor.phone)) {
    reasons.push("Teléfono incompleto");
    score += 15;
  }

  return {
    level: donor.paymentStatus === "failed" ? "critical" : reasons.length > 0 ? "follow_up" : "ok",
    reasons,
    score: score + donor.monthlyAmount / 1000,
  };
}

export function sortDonorsByPriority(donors: Donor[]) {
  return [...donors].sort((a, b) => getDonorRisk(b).score - getDonorRisk(a).score);
}

export function getDonorMetrics(donors: Donor[]): DonorMetrics {
  const activeCritical = donors.filter(
    (donor) => donor.paymentStatus === "failed" && donor.followUpStatus !== "recovered" && donor.followUpStatus !== "cancelled",
  );
  const recovered = donors.filter((donor) => donor.followUpStatus === "recovered");
  const additionalFollowUp = donors.filter((donor) => getDonorRisk(donor).level === "follow_up");
  const criticalMonthlyAmount = activeCritical.reduce((total, donor) => total + donor.monthlyAmount, 0);
  const recoveredMonthlyAmount = recovered.reduce((total, donor) => total + donor.monthlyAmount, 0);

  return {
    totalDonors: donors.length,
    criticalCount: activeCritical.length,
    criticalMonthlyAmount,
    criticalAnnualAmount: criticalMonthlyAmount * 12,
    additionalFollowUpCount: additionalFollowUp.length,
    recoveredMonthlyAmount,
    recoveredAnnualAmount: recoveredMonthlyAmount * 12,
  };
}

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
    return `Hola ${firstName}, soy del equipo de Pulso Comunitario. Te escribo porque este mes no pudimos procesar tu aporte de ${amount}. Con aportes como el tuyo, este mes ${donor.impactText}. Si querés, te pasamos el link seguro de la organización para actualizarlo. Gracias por seguir cerca.`;
  }

  if (daysSince(donor.lastAmountUpdateDate) > 120) {
    const suggestedAmount = formatCurrency(Math.round((donor.monthlyAmount * 1.3) / 500) * 500);
    return `Hola ${firstName}, gracias por acompañar a Pulso Comunitario. Tu aporte de ${amount} sigue siendo muy valioso, pero quedó desactualizado frente a los costos actuales. Si podés actualizarlo a ${suggestedAmount}, nos ayudás a sostener ${donor.cause.toLowerCase()}.`;
  }

  return `Hola ${firstName}, queríamos contarte qué hizo posible tu aporte: este mes ${donor.impactText}. Gracias por sostener ${donor.cause.toLowerCase()} y seguir cerca.`;
}

export function buildWhatsAppLink(donor: Donor, message: string) {
  const phone = donor.phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Pagado",
  failed: "Rechazado",
  pending: "Pendiente",
  unknown: "Desconocido",
};

export const followUpStatusLabels: Record<FollowUpStatus, string> = {
  pending: "Pendiente",
  contacted: "Contactado",
  recovered: "Recuperado",
  wants_increase: "Quiere aumentar",
  needs_follow_up: "Requiere seguimiento",
  cancelled: "Baja",
};
