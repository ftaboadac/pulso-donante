import { getDonorRisk } from "@/lib/risk";
import type { Donor } from "@/types/donor";

export type DashboardMetrics = {
  totalDonors: number;
  criticalRiskCount: number;
  criticalMonthlyAtRisk: number;
  criticalAnnualAtRisk: number;
  additionalFollowUpCount: number;
  monthlyRecovered: number;
  annualRecovered: number;
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

export function getDashboardMetrics(donors: Donor[]): DashboardMetrics {
  const activeCritical = donors.filter(
    (donor) =>
      donor.paymentStatus === "failed" &&
      donor.followUpStatus !== "recovered" &&
      donor.followUpStatus !== "cancelled",
  );
  const recovered = donors.filter((donor) => donor.followUpStatus === "recovered");
  const additionalFollowUp = donors.filter((donor) => getDonorRisk(donor).level === "follow_up");
  const criticalMonthlyAmount = activeCritical.reduce((total, donor) => total + donor.monthlyAmount, 0);
  const recoveredMonthlyAmount = recovered.reduce((total, donor) => total + donor.monthlyAmount, 0);

  return {
    totalDonors: donors.length,
    criticalRiskCount: activeCritical.length,
    criticalMonthlyAtRisk: criticalMonthlyAmount,
    criticalAnnualAtRisk: criticalMonthlyAmount * 12,
    additionalFollowUpCount: additionalFollowUp.length,
    monthlyRecovered: recoveredMonthlyAmount,
    annualRecovered: recoveredMonthlyAmount * 12,
  };
}

export function getDonorMetrics(donors: Donor[]): DonorMetrics {
  const metrics = getDashboardMetrics(donors);

  return {
    totalDonors: metrics.totalDonors,
    criticalCount: metrics.criticalRiskCount,
    criticalMonthlyAmount: metrics.criticalMonthlyAtRisk,
    criticalAnnualAmount: metrics.criticalAnnualAtRisk,
    additionalFollowUpCount: metrics.additionalFollowUpCount,
    recoveredMonthlyAmount: metrics.monthlyRecovered,
    recoveredAnnualAmount: metrics.annualRecovered,
  };
}
