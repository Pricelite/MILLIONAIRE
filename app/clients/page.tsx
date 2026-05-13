"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

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
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-5 p-4 md:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600">
        <ArrowLeft className="h-4 w-4" />
        Retour dashboard
      </Link>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Mes clients</h1>
            <p className="text-sm text-slate-600">{clients.length} client(s)</p>
          </div>
          <Link className="btn-primary" href="/clients/ajouter">
            Ajouter un client
          </Link>
        </div>
      </section>

      {clients.length === 0 ? (
        <section className="card p-5 text-sm text-slate-600">Aucun client pour le moment.</section>
      ) : (
        <section className="grid gap-3 md:grid-cols-2">
          {clients.map((client) => (
            <article key={client.clientCode} className="card p-4">
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
    </main>
  );
}

