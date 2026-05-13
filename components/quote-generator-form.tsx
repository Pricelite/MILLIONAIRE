"use client";

import { useEffect, useState } from "react";

type QuoteResult = {
  title: string;
  scope: string;
  laborHours: number;
  laborCost: number;
  materialCost: number;
  marginRate: number;
  vatRate: number;
  totalExclTax: number;
  totalVat: number;
  totalInclTax: number;
  assumptions?: string[];
  detectedTrade?: string;
  confidence?: number;
  lines: Array<{
    label: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
    category: "materiau" | "main_oeuvre" | "frais";
  }>;
};

export function QuoteGeneratorForm() {
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("fr_standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setProgress(8);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const jump = prev < 40 ? 9 : prev < 75 ? 5 : 2;
        return Math.min(92, prev + jump);
      });
    }, 220);
    return () => clearInterval(timer);
  }, [loading]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quotes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, region })
      });

      if (!res.ok) {
        throw new Error("Generation impossible.");
      }

      const data = (await res.json()) as { quote: QuoteResult };
      setProgress(100);
      setResult(data.quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setTimeout(() => setProgress(0), 250);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Nouveau devis IA</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            placeholder="Ex: Pose carrelage salle de bain 12m2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="fr_standard">France standard</option>
            <option value="ile_de_france">Ile-de-France</option>
            <option value="sud_est">Sud-Est</option>
            <option value="dom_tom">DOM-TOM</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Generation..." : "Generer"}
          </button>
        </div>
        {loading || progress > 0 ? (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Conception du devis en cours...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </form>

      {result ? (
        <section className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-sm text-slate-500">{result.scope}</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-right">
              <p className="text-xs uppercase text-slate-500">Total TTC</p>
              <p className="text-xl font-bold">{result.totalInclTax.toFixed(2)} EUR</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2">Poste</th>
                  <th className="py-2">Qt</th>
                  <th className="py-2">Unite</th>
                  <th className="py-2">PU</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.lines.map((line, idx) => (
                  <tr key={`${line.label}-${idx}`} className="border-b border-slate-100">
                    <td className="py-2">{line.label}</td>
                    <td className="py-2">{line.quantity}</td>
                    <td className="py-2">{line.unit}</td>
                    <td className="py-2">{line.unitPrice.toFixed(2)} EUR</td>
                    <td className="py-2">{line.total.toFixed(2)} EUR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Materiaux</p>
              <p className="font-semibold">{result.materialCost.toFixed(2)} EUR</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Main-d&apos;oeuvre</p>
              <p className="font-semibold">{result.laborCost.toFixed(2)} EUR</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">TVA</p>
              <p className="font-semibold">{result.totalVat.toFixed(2)} EUR</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Marge</p>
              <p className="font-semibold">{Math.round(result.marginRate * 100)}%</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Metier detecte</p>
              <p className="font-semibold capitalize">{result.detectedTrade ?? "general"}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Confiance estimation</p>
              <p className="font-semibold">{Math.round((result.confidence ?? 0.6) * 100)}%</p>
            </div>
          </div>
          {result.assumptions?.length ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Hypotheses utilisees</p>
              <ul className="mt-1 list-disc pl-5">
                {result.assumptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
