"use client";

import Link from "next/link";
import { Bot, ClipboardList, Home, Menu, Settings } from "lucide-react";

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
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard#tasks", label: "Tasks", icon: ClipboardList },
  { href: "/dashboard#ai", label: "AI summary", icon: Bot },
  { href: "/login", label: "Auth", icon: Settings },
] as const;

export function MobileNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="font-semibold">
        Hackathon Starter
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription className="sr-only">Move between the starter dashboard, tasks, AI demo, and auth screen.</SheetDescription>
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
