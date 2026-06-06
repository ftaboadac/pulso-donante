import Link from "next/link";
import { FileSpreadsheet, HeartPulse, Home, LayoutDashboard } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/onboarding", label: "Cargar planilla", icon: FileSpreadsheet },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-accent-foreground">
            <HeartPulse className="size-5" />
          </span>
          <span>Pulso Donante</span>
        </Link>
      </div>
      <Separator className="bg-white/10" />
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-5 text-xs leading-5 text-sidebar-foreground/60">
        La app sugiere. La persona decide.
      </div>
    </aside>
  );
}
