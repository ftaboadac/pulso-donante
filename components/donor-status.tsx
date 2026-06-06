import { RiskBadge as DonorRiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Donor } from "@/types/donor";

export function RiskBadge({ donor }: { donor: Donor }) {
  return <DonorRiskBadge donor={donor} />;
}

export function FollowUpBadge({ donor }: { donor: Donor }) {
  return <StatusBadge status={donor.followUpStatus} />;
}
