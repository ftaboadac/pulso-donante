import { Activity } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Activity className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">Pulso Donante</span>
    </div>
  );
}
