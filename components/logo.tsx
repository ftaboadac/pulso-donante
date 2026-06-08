import { HeartHandshake } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(28,118,98,0.22)]">
        <HeartHandshake className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">Pulso Donante</span>
    </div>
  );
}
