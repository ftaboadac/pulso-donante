"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, FileSpreadsheet, HeartHandshake, Home, LayoutDashboard, ShieldCheck } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/onboarding", label: "Cargar planilla", icon: FileSpreadsheet },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function AppSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 hidden flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground shadow-[18px_0_50px_rgba(20,31,44,0.12)] transition-[width] duration-200 lg:flex",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center", collapsed ? "justify-center px-3" : "justify-between px-5")}>
        <Link href="/" className={cn("flex items-center gap-3 font-semibold", collapsed && "justify-center")} title="Pulso Donante">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/14 text-sidebar-accent-foreground ring-1 ring-white/12">
            <HeartHandshake className="size-5" />
          </span>
          {!collapsed && (
            <span>
              Pulso Donante
              <span className="block text-xs font-medium text-sidebar-foreground/55">Sala de cuidado</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            "hidden size-8 items-center justify-center rounded-md text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:flex",
            collapsed && "absolute right-2 top-4",
          )}
          aria-label={collapsed ? "Expandir navegación" : "Minimizar navegación"}
          title={collapsed ? "Expandir" : "Minimizar"}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>
      <Separator className="bg-white/10" />
      <nav className={cn("flex-1 space-y-1 py-4", collapsed ? "px-3" : "px-3")}>
        {navItems.map((item) => {
          const active = isActiveNavItem(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition hover:bg-white/10 hover:text-sidebar-accent-foreground",
                collapsed ? "justify-center px-2" : "px-3",
                active
                  ? "bg-white/14 text-sidebar-accent-foreground shadow-[inset_3px_0_0_rgba(255,255,255,0.42)]"
                  : "text-sidebar-foreground/80",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="m-3 rounded-lg border border-white/12 bg-white/[0.06] p-4 text-xs leading-5 text-sidebar-foreground/72">
          <div className="mb-2 flex items-center gap-2 font-semibold text-sidebar-foreground">
            <ShieldCheck className="size-4" />
            Control humano
          </div>
          La app prioriza y sugiere. La persona decide, edita y envía.
        </div>
      )}
    </aside>
  );
}

function isActiveNavItem(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/donor/");
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
