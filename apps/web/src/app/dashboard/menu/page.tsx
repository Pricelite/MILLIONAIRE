"use client";

import { currency } from "@restomaster/utils";
import { useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import { menuItems as seedMenuItems } from "@/lib/mock-data";

export default function MenuPage() {
  const [items, setItems] = useState(seedMenuItems);

  function toggleAvailability(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <Surface className="overflow-hidden">
        <div className="grid grid-cols-6 gap-0 border-b border-white/10 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <span>Plat</span>
          <span>Categorie</span>
          <span>Prix</span>
          <span>Allergenes</span>
          <span>Disponibilite</span>
          <span>Action</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-6 items-center gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-b-0">
            <span className="font-semibold text-zinc-100">{item.name}</span>
            <span className="text-zinc-300">{item.category}</span>
            <span className="text-zinc-300">{currency(item.price)}</span>
            <span className="text-zinc-400">{item.allergens}</span>
            <StatusBadge label={item.available ? "Disponible" : "Indisponible"} tone={item.available ? "success" : "danger"} />
            <button
              type="button"
              onClick={() => toggleAvailability(item.id)}
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs font-semibold text-zinc-200"
            >
              Basculer
            </button>
          </div>
        ))}
      </Surface>

      <Surface className="space-y-3 p-4 md:p-5">
        <h3 className="text-lg font-bold text-white">Nouveau plat</h3>
        <input className="h-10 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" placeholder="Nom du plat" />
        <input className="h-10 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" placeholder="Categorie" />
        <input className="h-10 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" placeholder="Prix" />
        <input className="h-10 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" placeholder="Allergenes" />
        <button type="button" className="w-full rounded-xl bg-sky-500 px-3 py-2 text-sm font-bold text-sky-950">
          Ajouter au menu
        </button>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-3 text-xs text-zinc-400">Menus du jour actifs: 2. Push QR menu en un clic.</div>
      </Surface>
    </div>
  );
}
