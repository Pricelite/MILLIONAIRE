"use client";

import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import { TableState, tables as initialTables } from "@/lib/mock-data";

type TableEntity = (typeof initialTables)[number];

type Zone = "Terrasse" | "Salle" | "Bar" | "VIP";

const zones: Zone[] = ["Terrasse", "Salle", "Bar", "VIP"];

function toneFromState(state: TableState) {
  if (state === "Libre") return "success" as const;
  if (state === "Reservee") return "info" as const;
  if (state === "Paiement en attente") return "warning" as const;
  return "danger" as const;
}

export default function TablesPage() {
  const [tableState, setTableState] = useState<TableEntity[]>(initialTables);
  const [dragId, setDragId] = useState<string | null>(null);

  const occupied = useMemo(() => tableState.filter((table) => table.state === "Occupee").length, [tableState]);

  function moveTable(tableId: string, zone: Zone) {
    setTableState((current) => current.map((table) => (table.id === tableId ? { ...table, zone } : table)));
  }

  return (
    <div className="space-y-4">
      <Surface className="flex flex-wrap items-center gap-3 p-4">
        <StatusBadge label={`${occupied} tables occupees`} tone="danger" />
        <StatusBadge label="Drag and drop actif" tone="info" />
        <button type="button" className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm font-semibold text-zinc-200">
          Fusionner tables
        </button>
        <button type="button" className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm font-semibold text-zinc-200">
          Separation facture
        </button>
      </Surface>

      <div className="grid gap-4 lg:grid-cols-2">
        {zones.map((zone) => (
          <Surface
            key={zone}
            className="min-h-56 p-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragId) moveTable(dragId, zone);
            }}
          >
            <h3 className="mb-3 text-lg font-bold text-white">{zone}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {tableState
                .filter((table) => table.zone === zone)
                .map((table) => (
                  <article
                    key={table.id}
                    draggable
                    onDragStart={() => setDragId(table.id)}
                    className="cursor-grab rounded-2xl border border-white/10 bg-zinc-900/60 p-3 active:cursor-grabbing"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-bold text-white">{table.id}</p>
                      <StatusBadge label={table.state} tone={toneFromState(table.state)} />
                    </div>
                    <p className="text-sm text-zinc-300">{table.seats} couverts</p>
                    <p className="text-xs text-zinc-400">Serveur: {table.server}</p>
                    <p className="text-xs text-zinc-500">Occupation: {table.minutes} min</p>
                  </article>
                ))}
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}
