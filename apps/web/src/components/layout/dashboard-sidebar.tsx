"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/orders", label: "Caisse" }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="hidden w-64 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 md:flex md:flex-col">
      <h1 className="mb-6 text-2xl font-black text-amber-400">RESTOMASTER</h1>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "block rounded-xl bg-amber-500 px-3 py-2 font-semibold text-black" : "block rounded-xl px-3 py-2 font-semibold text-zinc-300 hover:bg-zinc-900"}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="mt-auto rounded-xl border border-zinc-800 px-3 py-2 text-left text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
        onClick={() => {
          logout();
          localStorage.removeItem("restomaster:accessToken");
          router.push("/login");
        }}
      >
        Deconnexion
      </button>
    </aside>
  );
}
