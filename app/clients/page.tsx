"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, PageShell } from "@/components/page-shell";

type ClientRecord = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  clientCode: string;
  createdAt: string;
};

function loadClients(): ClientRecord[] {
  try {
    const raw = window.localStorage.getItem("devispro_clients");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClientRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    setClients(loadClients());
  }, []);

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Mes clients"
        subtitle={`${clients.length} client(s)`}
        actions={
          <Link className="btn-primary" href="/clients/ajouter">
            Ajouter un client
          </Link>
        }
      />

      {clients.length === 0 ? (
        <section className="surface-panel p-5 text-sm text-slate-600">
          Aucun client pour le moment.
        </section>
      ) : (
        <section className="grid gap-3 md:grid-cols-2">
          {clients.map((client) => (
            <article key={client.clientCode} className="surface-panel p-4">
              <h2 className="text-lg font-semibold">{client.fullName}</h2>
              <p className="text-xs text-slate-500">{client.clientCode}</p>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>Telephone: {client.phone || "-"}</p>
                <p>Email: {client.email || "-"}</p>
                <p>
                  Adresse: {[client.address, client.postalCode, client.city].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </PageShell>
  );
}
