"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

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
    subCategory?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
    vatRate: number;
    category: "materiau" | "main_oeuvre" | "frais";
  }>;
};

export function QuoteGeneratorForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const region = "fr_standard";
  const detailLevel: "standard" | "expert" = "expert";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [editableLines, setEditableLines] = useState<QuoteResult["lines"]>([]);
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
        body: JSON.stringify({ description, region, detailLevel })
      });

      if (!res.ok) {
        const message = await readApiError(res, "Generation impossible.");
        throw new Error(message);
      }

      const data = (await res.json()) as { quote: QuoteResult };
      if (!data?.quote?.lines || !Array.isArray(data.quote.lines)) {
        throw new Error("Reponse invalide du serveur.");
      }
      setProgress(100);
      setResult(data.quote);
      setEditableLines(data.quote.lines);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setTimeout(() => setProgress(0), 250);
      setLoading(false);
    }
  }

  function moveToFormalQuote() {
    if (!result) return;
    const totals = recomputeTotals(editableLines, result.marginRate);
    const quote = {
      ...result,
      lines: editableLines,
      laborHours: editableLines
        .filter((line) => line.category === "main_oeuvre")
        .reduce((sum, line) => sum + line.quantity, 0),
      laborCost: totals.laborCost,
      materialCost: totals.materialCost,
      vatRate: totals.vatRate,
      totalExclTax: totals.totalExclTax,
      totalVat: totals.totalVat,
      totalInclTax: totals.totalInclTax
    };
    const payload = {
      createdAt: new Date().toISOString(),
      sourceDescription: description,
      region,
      detailLevel,
      quote
    };
    window.localStorage.setItem("devispro_quote_draft", JSON.stringify(payload));
    router.push("/devis/convertir");
  }

  function sumCategory(category: "materiau" | "main_oeuvre" | "frais") {
    return editableLines
      .filter((line) => line.category === category)
      .reduce((sum, line) => sum + (Number(line.total) || 0), 0);
  }

  function removeGeneratedLine(index: number) {
    setEditableLines((prev) => prev.filter((_, idx) => idx !== index));
  }

  const totals = result ? recomputeTotals(editableLines, result.marginRate) : null;

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="surface-panel p-4">
        <h2 className="mb-3 text-lg font-semibold">Nouveau devis IA</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="form-control"
            placeholder="Ex: Pose carrelage salle de bain 12m2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
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
        <section className="surface-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-sm text-slate-500">{result.scope}</p>
            </div>
            <div className="surface-muted px-3 py-2 text-right">
              <p className="text-xs uppercase text-slate-500">Total TTC</p>
              <p className="text-xl font-bold">{(totals?.totalInclTax ?? result.totalInclTax).toFixed(2)} EUR</p>
            </div>
          </div>

          <div className="table-wrap mt-4">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="table-head-row">
                  <th className="py-2">Poste</th>
                  <th className="py-2">Sous-categorie</th>
                  <th className="py-2">Qt</th>
                  <th className="py-2">Unite</th>
                  <th className="py-2">PU</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {editableLines.map((line, idx) => (
                  <tr key={`${line.label}-${idx}`} className="table-row">
                    <td className="py-2">{line.label}</td>
                    <td className="py-2">{line.subCategory ?? "-"}</td>
                    <td className="py-2">{line.quantity}</td>
                    <td className="py-2">{line.unit}</td>
                    <td className="py-2">{line.unitPrice.toFixed(2)} EUR</td>
                    <td className="py-2">{line.total.toFixed(2)} EUR</td>
                    <td className="py-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        onClick={() => removeGeneratedLine(idx)}
                        aria-label="Supprimer la ligne"
                        title="Supprimer la ligne"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
            <div className="surface-muted">
              <p className="text-slate-500">Fournitures</p>
              <p className="font-semibold">{sumCategory("materiau").toFixed(2)} EUR</p>
            </div>
            <div className="surface-muted">
              <p className="text-slate-500">Pose (main-d&apos;oeuvre)</p>
              <p className="font-semibold">{sumCategory("main_oeuvre").toFixed(2)} EUR</p>
            </div>
            <div className="surface-muted">
              <p className="text-slate-500">Frais</p>
              <p className="font-semibold">{sumCategory("frais").toFixed(2)} EUR</p>
            </div>
            <div className="surface-muted">
              <p className="text-slate-500">TVA</p>
              <p className="font-semibold">{(totals?.totalVat ?? result.totalVat).toFixed(2)} EUR</p>
            </div>
          </div>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
            <div className="surface-muted">
              <p className="text-slate-500">Total HT</p>
              <p className="font-semibold">{(totals?.totalExclTax ?? result.totalExclTax).toFixed(2)} EUR</p>
            </div>
            <div className="surface-muted">
              <p className="text-slate-500">Marge estimee</p>
              <p className="font-semibold">{Math.round(result.marginRate * 100)}%</p>
            </div>
            <div className="surface-muted">
              <p className="text-slate-500">Total TTC</p>
              <p className="font-semibold">{(totals?.totalInclTax ?? result.totalInclTax).toFixed(2)} EUR</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <div className="surface-muted">
              <p className="text-slate-500">Metier detecte</p>
              <p className="font-semibold capitalize">{result.detectedTrade ?? "general"}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Confiance estimation</p>
              <p className="font-semibold">{Math.round((result.confidence ?? 0.6) * 100)}%</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Niveau de detail</p>
              <p className="font-semibold">{detailLevel === "expert" ? "Expert" : "Standard"}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <p className="text-slate-500">Nombre de lignes</p>
              <p className="font-semibold">{editableLines.length}</p>
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
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={moveToFormalQuote}>
              Passer en devis
            </button>
            <p className="self-center text-xs text-slate-500">
              Inclura entreprise, client, TVA, delais, conditions et mentions de devis.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function recomputeTotals(lines: QuoteResult["lines"], marginRate: number) {
  const subTotal = round2(lines.reduce((sum, line) => sum + (Number(line.total) || 0), 0));
  const marginValue = round2(subTotal * marginRate);
  const totalExclTax = round2(subTotal + marginValue);
  const vatRate = averageVat(lines);
  const totalVat = round2(totalExclTax * vatRate);
  const totalInclTax = round2(totalExclTax + totalVat);
  const laborCost = round2(
    lines.filter((line) => line.category === "main_oeuvre").reduce((sum, line) => sum + line.total, 0)
  );
  const materialCost = round2(
    lines.filter((line) => line.category === "materiau").reduce((sum, line) => sum + line.total, 0)
  );
  return {
    vatRate,
    totalExclTax,
    totalVat,
    totalInclTax,
    laborCost,
    materialCost
  };
}

function averageVat(lines: QuoteResult["lines"]) {
  const base = lines.reduce((sum, line) => sum + line.total, 0);
  if (!base) return 0.2;
  return round2(lines.reduce((sum, line) => sum + line.total * line.vatRate, 0) / base);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

async function readApiError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}
