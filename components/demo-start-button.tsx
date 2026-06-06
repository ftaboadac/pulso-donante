"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetDonors } from "@/lib/store";

export function DemoStartButton() {
  const router = useRouter();

  function startImport() {
    router.push("/onboarding");
  }

  function startSeedDemo() {
    resetDonors();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg" className="h-12 px-6" onClick={startImport}>
        <FileSpreadsheet />
        Iniciar demo
        <ArrowRight />
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-6" onClick={startSeedDemo}>
        Ver dashboard de ejemplo
      </Button>
    </div>
  );
}
