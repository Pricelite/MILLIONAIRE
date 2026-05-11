"use client";

import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import { OrderState, liveOrders } from "@/lib/mock-data";

type Order = (typeof liveOrders)[number];

const columns: OrderState[] = ["En attente", "En preparation", "Prete", "Servie", "Annulee"];

function nextState(current: OrderState): OrderState {
  if (current === "En attente") return "En preparation";
  if (current === "En preparation") return "Prete";
  if (current === "Prete") return "Servie";
  return current;
}

function stateTone(state: OrderState) {
  if (state === "Servie") return "success" as const;
  if (state === "Annulee") return "danger" as const;
  if (state === "Prete") return "info" as const;
  if (state === "En preparation") return "warning" as const;
  return "neutral" as const;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(liveOrders);
  const pendingCount = useMemo(() => orders.filter((order) => order.state !== "Servie" && order.state !== "Annulee").length, [orders]);

  function advance(id: string) {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, state: nextState(order.state) } : order)));
  }

  return (
    <div className="space-y-4">
      <Surface className="flex flex-wrap items-center gap-2 p-4">
        <StatusBadge label={`${pendingCount} commandes en cours`} tone="warning" />
        <StatusBadge label="Notifications live activees" tone="success" />
      </Surface>

      <div className="grid gap-3 xl:grid-cols-5">
        {columns.map((column) => (
          <Surface key={column} className="space-y-3 p-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">{column}</h3>
            {orders
              .filter((order) => order.state === column)
              .map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-white">{order.id}</p>
                    <StatusBadge label={order.priority} tone={order.priority === "Urgente" ? "danger" : "warning"} />
                  </div>
                  <p className="text-sm text-zinc-200">Table: {order.table}</p>
                  <p className="text-xs text-zinc-400">{order.items} articles</p>
                  <p className="text-xs text-zinc-400">ETA: {order.eta} min</p>
                  {column !== "Servie" && column !== "Annulee" ? (
                    <button
                      type="button"
                      className="mt-3 w-full rounded-xl border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-xs font-semibold text-sky-200"
                      onClick={() => advance(order.id)}
                    >
                      Passer a l&apos;etape suivante
                    </button>
                  ) : null}
                </article>
              ))}
          </Surface>
        ))}
      </div>
    </div>
  );
}
