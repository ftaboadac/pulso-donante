import { Badge } from "@/components/ui/badge";
import { followUpStatusLabels } from "@/lib/donors";
import { cn } from "@/lib/utils";
import type { FollowUpStatus } from "@/types/donor";

const statusClasses: Record<FollowUpStatus, string> = {
  pending: "border-border bg-secondary text-muted-foreground",
  contacted: "border-sky-200 bg-sky-50 text-sky-700",
  recovered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  wants_increase: "border-violet-200 bg-violet-50 text-violet-700",
  needs_follow_up: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export function StatusBadge({ status }: { status: FollowUpStatus }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", statusClasses[status])}>
      {followUpStatusLabels[status]}
    </Badge>
  );
}
