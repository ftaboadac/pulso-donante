import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "text-foreground border-border bg-card",
  danger: "text-red-800 border-red-200 bg-red-50/80",
  warning: "text-amber-800 border-amber-200 bg-amber-50/80",
  success: "text-emerald-800 border-emerald-200 bg-emerald-50/80",
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
    <div className={cn("min-h-28 rounded-lg border p-4 shadow-sm hairline-top", toneClasses[tone])}>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs font-medium leading-snug text-muted-foreground">{label}</p>
      {detail ? <p className="mt-2 text-xs font-medium text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
