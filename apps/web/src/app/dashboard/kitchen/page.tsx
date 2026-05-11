"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import { kitchenStations } from "@/lib/mock-data";

export default function KitchenPage() {
  const [stations, setStations] = useState(kitchenStations);

  function markReady(stationName: string, ticketId: string) {
    setStations((current) =>
      current.map((station) => {
        if (station.station !== stationName) return station;
        return { ...station, tickets: station.tickets.filter((ticket) => ticket.id !== ticketId) };
      })
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {stations.map((station) => (
        <Surface key={station.station} className="space-y-3 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Poste {station.station}</h3>
            <StatusBadge label={`${station.tickets.length} tickets`} tone="info" />
          </div>
          <div className="space-y-3">
            {station.tickets.length === 0 ? <p className="text-sm text-zinc-400">Aucune commande sur ce poste.</p> : null}
            {station.tickets.map((ticket) => (
              <article key={ticket.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-white">{ticket.id}</p>
                  <StatusBadge label={ticket.priority} tone={ticket.priority === "Urgente" ? "danger" : "warning"} />
                </div>
                <p className="text-sm text-zinc-200">{ticket.items}</p>
                <p className="mt-1 text-xs text-zinc-400">Timer: {ticket.elapsed} min</p>
                <button
                  type="button"
                  onClick={() => markReady(station.station, ticket.id)}
                  className="mt-3 w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-bold text-emerald-950"
                >
                  Commande prete
                </button>
              </article>
            ))}
          </div>
        </Surface>
      ))}
    </div>
  );
}
