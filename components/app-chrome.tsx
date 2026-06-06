"use client";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!pathname.startsWith("/donor/")) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64">
        <MobileNav />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
