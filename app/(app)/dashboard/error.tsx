"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <h2 className="text-2xl font-semibold">The dashboard hit an error.</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{error.message}</p>
      </div>
      <Button onClick={reset}>
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
