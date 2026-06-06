"use client";

import Link from "next/link";
import { FileSpreadsheet, HeartPulse, Home, LayoutDashboard, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/onboarding", label: "Cargar planilla", icon: FileSpreadsheet },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function MobileNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
        <HeartPulse className="size-5" />
        Pulso Donante
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Pulso Donante</SheetTitle>
            <SheetDescription className="sr-only">Navegá entre el inicio, la carga de planilla y el dashboard.</SheetDescription>
          </SheetHeader>
          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
