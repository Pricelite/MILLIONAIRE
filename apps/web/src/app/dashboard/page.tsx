"use client";

import { currency } from "@restomaster/utils";

import { useAuthStore } from "@/lib/auth-store";
import { useDashboardStats } from "@/lib/queries";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const stats = useDashboardStats(Boolean(user));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black">Dashboard</h2>
      <p className="text-sm text-zinc-400">Connecte en tant que {user?.email ?? "utilisateur"}</p>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-400">Chiffre d&apos;affaires</p>
          <p className="text-xl font-bold">{currency(stats.data?.revenue ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-400">Commandes</p>
          <p className="text-xl font-bold">{stats.data?.ordersCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-400">Ticket moyen</p>
          <p className="text-xl font-bold">{currency(stats.data?.averageOrderValue ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}
