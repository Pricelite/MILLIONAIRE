"use client";

import { Bell, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Surface } from "@/components/ui/surface";

export function DashboardTopbar() {
  const [now, setNow] = useState(() => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Surface className="mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Service en cours</p>
        <h2 className="text-2xl font-extrabold text-white">Operations restaurant</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
          <Sparkles className="h-4 w-4" />
          Temps reel actif
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1 text-zinc-200">
          <Clock3 className="h-4 w-4" />
          {now}
        </span>
        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1 text-zinc-100">
          <Bell className="h-4 w-4" />
          4 alertes
        </button>
      </div>
    </Surface>
  );
}
