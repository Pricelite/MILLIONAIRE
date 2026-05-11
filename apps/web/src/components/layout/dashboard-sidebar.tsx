"use client";

import { Bell, ChefHat, ClipboardList, CreditCard, LayoutDashboard, Package, Settings, Table2, Users, UtensilsCrossed, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/components/ui/cn";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tables", label: "Tables", icon: Table2 },
  { href: "/dashboard/pos", label: "Caisse POS", icon: CreditCard },
  { href: "/dashboard/orders", label: "Commandes", icon: ClipboardList },
  { href: "/dashboard/kitchen", label: "Cuisine", icon: ChefHat },
  { href: "/dashboard/reservations", label: "Reservations", icon: Bell },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/inventory", label: "Stock", icon: Package },
  { href: "/dashboard/employees", label: "Employes", icon: Users },
  { href: "/dashboard/loyalty", label: "Fidelite", icon: WalletCards },
  { href: "/dashboard/analytics", label: "Statistiques", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Parametres", icon: Settings }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-full rounded-3xl border border-white/15 bg-zinc-950/80 p-4 backdrop-blur-sm md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-64 md:shrink-0 md:overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-sky-300">RestoMaster</p>
          <h1 className="text-xl font-black text-white">Ops Console</h1>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Live
        </span>
      </div>

      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                active
                  ? "border-sky-400/45 bg-sky-500/18 text-white"
                  : "border-transparent bg-zinc-900/55 text-zinc-200 hover:border-white/15 hover:bg-zinc-800/80"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="mt-4 w-full rounded-2xl border border-white/15 bg-zinc-900/70 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800/85"
        onClick={() => {
          logout();
          localStorage.removeItem("restomaster:accessToken");
          router.push("/login");
        }}
      >
        Deconnexion securisee
      </button>
    </aside>
  );
}
