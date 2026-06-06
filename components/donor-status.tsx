import { Badge } from "@/components/ui/badge";
import { followUpStatusLabels, getDonorRisk } from "@/lib/donors";
import { cn } from "@/lib/utils";
import type { Donor } from "@/types/donor";

export function RiskBadge({ donor }: { donor: Donor }) {
  const risk = getDonorRisk(donor);

  if (donor.followUpStatus === "recovered") {
    return <Badge className="border-transparent bg-emerald-100 text-emerald-800">Recuperado</Badge>;
  }

  const labels = {
    critical: "Crítico",
    follow_up: "Seguimiento",
    ok: "Al día",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        risk.level === "critical" && "border-red-200 bg-red-50 text-red-700",
        risk.level === "follow_up" && "border-amber-200 bg-amber-50 text-amber-700",
        risk.level === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-700",
      )}
    >
      {labels[risk.level]}
    </Badge>
  );
}

export function FollowUpBadge({ donor }: { donor: Donor }) {
  return <Badge variant="secondary">{followUpStatusLabels[donor.followUpStatus]}</Badge>;
}
