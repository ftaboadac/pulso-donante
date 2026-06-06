import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "text-foreground",
  danger: "text-red-700",
  warning: "text-amber-700",
  success: "text-emerald-700",
};

export function MetricCard({
  value,
  label,
  detail,
  tone = "neutral",
}: {
  value: string;
  label: string;
  detail?: string;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className={cn("text-2xl font-semibold tracking-tight", toneClasses[tone])}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-muted-foreground">{label}</p>
      {detail ? <p className="mt-2 text-xs font-medium text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
