"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetDonors } from "@/lib/store";

export function DemoStartButton() {
  const router = useRouter();

  function startDemo() {
    resetDonors();
    router.push("/onboarding");
  }

  return (
    <Button size="lg" className="h-12 px-6" onClick={startDemo}>
      Iniciar demo
      <ArrowRight />
    </Button>
  );
}
