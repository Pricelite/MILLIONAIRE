"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

type ClientForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
};

type ClientRecord = ClientForm & {
  clientCode: string;
  createdAt: string;
};

const initialForm: ClientForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: ""
};

function buildClientCode() {
  const stamp = Date.now().toString().slice(-6);
  return `CL-${stamp}`;
}

function getStoredClients(): ClientRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("devispro_clients");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClientRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AddClientPage() {
  const [form, setForm] = useState<ClientForm>(initialForm);
  const [createdRecord, setCreatedRecord] = useState<ClientRecord | null>(null);

  const canSubmit = useMemo(() => {
    return form.fullName.trim().length >= 2 && form.phone.trim().length >= 6;
  }, [form.fullName, form.phone]);

  function updateField(field: keyof ClientForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const record: ClientRecord = {
      ...form,
      clientCode: buildClientCode(),
      createdAt: new Date().toISOString()
    };

    const stored = getStoredClients();
    window.localStorage.setItem("devispro_clients", JSON.stringify([record, ...stored]));
    setCreatedRecord(record);
    setForm(initialForm);
  }

  function downloadRecord() {
    if (!createdRecord) return;
    const payload = JSON.stringify(createdRecord, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${createdRecord.clientCode}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl space-y-5 p-4 md:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600">
        <ArrowLeft className="h-4 w-4" />
        Retour dashboard
      </Link>

      <section className="card p-5">
        <h1 className="text-2xl font-bold">Ajouter un client</h1>
        <p className="mt-1 text-sm text-slate-600">Creation d&apos;une fiche client rapide pour les devis et factures.</p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            placeholder="Nom complet *"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            placeholder="Telephone *"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            placeholder="Code postal"
            value={form.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500 md:col-span-2"
            placeholder="Adresse"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500 md:col-span-2"
            placeholder="Ville"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
          <textarea
            className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500 md:col-span-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <button type="submit" className="btn-primary md:col-span-2" disabled={!canSubmit}>
            Creer la fiche client
          </button>
        </form>
      </section>

      {createdRecord ? (
        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Fiche client creee</h2>
              <p className="text-sm text-slate-600">
                Code: <span className="font-semibold">{createdRecord.clientCode}</span>
              </p>
            </div>
            <button type="button" className="btn-secondary" onClick={downloadRecord}>
              Telecharger le fichier client
            </button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-100 p-4 text-xs text-slate-700">
            {JSON.stringify(createdRecord, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  );
}
