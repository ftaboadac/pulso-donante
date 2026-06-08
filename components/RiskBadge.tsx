import { Badge } from "@/components/ui/badge";
import { getDonorRisk } from "@/lib/donors";
import { cn } from "@/lib/utils";
import type { Donor } from "@/types/donor";

export function RiskBadge({ donor }: { donor: Donor }) {
  if (donor.followUpStatus === "recovered") {
    return <Badge className="border-transparent bg-emerald-100 text-emerald-900 shadow-xs">Recuperado</Badge>;
  }

  if (donor.followUpStatus === "cancelled") {
    return <Badge variant="secondary">Baja</Badge>;
  }

  const risk = getDonorRisk(donor);
  const labels = {
    critical: "Crítico",
    follow_up: "Seguimiento",
    ok: "Al día",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold shadow-xs",
        risk.level === "critical" && "border-red-200 bg-red-50 text-red-800",
        risk.level === "follow_up" && "border-amber-200 bg-amber-50 text-amber-800",
        risk.level === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {labels[risk.level]}
    </Badge>
  );
}
