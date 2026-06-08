import { Badge } from "@/components/ui/badge";
import { followUpStatusLabels } from "@/lib/donors";
import { cn } from "@/lib/utils";
import type { FollowUpStatus } from "@/types/donor";

const statusClasses: Record<FollowUpStatus, string> = {
  pending: "border-border bg-secondary text-muted-foreground",
  contacted: "border-sky-200 bg-sky-50 text-sky-800",
  recovered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  wants_increase: "border-rose-200 bg-rose-50 text-rose-800",
  needs_follow_up: "border-amber-200 bg-amber-50 text-amber-800",
  cancelled: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export function StatusBadge({ status }: { status: FollowUpStatus }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-semibold shadow-xs", statusClasses[status])}>
      {followUpStatusLabels[status]}
    </Badge>
  );
}
