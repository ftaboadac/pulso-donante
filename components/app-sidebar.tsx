import Link from "next/link";
import { Bot, ClipboardList, Home, LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard#tasks", label: "Tasks", icon: ClipboardList },
  { href: "/dashboard#ai", label: "AI summary", icon: Bot },
  { href: "/login", label: "Auth", icon: Settings },
] as const;

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
            H
          </span>
          <span>Hackathon Starter</span>
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
      <div className="p-3">
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
