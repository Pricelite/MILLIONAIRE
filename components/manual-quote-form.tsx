"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type ManualLine = {
  label: string;
  subCategory: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  category: "materiau" | "main_oeuvre" | "frais";
};

const emptyLine: ManualLine = {
  label: "",
  subCategory: "",
  quantity: 1,
  unit: "u",
  unitPrice: 0,
  vatRate: 0.2,
  category: "materiau"
};

export function ManualQuoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("Devis chantier");
  const [scope, setScope] = useState("");
  const [lines, setLines] = useState<ManualLine[]>([emptyLine]);

  const totals = useMemo(() => {
    const totalExclTax = round2(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
    const totalVat = round2(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * line.vatRate, 0));
    const totalInclTax = round2(totalExclTax + totalVat);
    return { totalExclTax, totalVat, totalInclTax };
  }, [lines]);

  const canContinue =
    title.trim().length >= 3 &&
    scope.trim().length >= 3 &&
    lines.some((line) => line.label.trim().length >= 2 && line.quantity > 0);

  function updateLine<K extends keyof ManualLine>(index: number, key: K, value: ManualLine[K]) {
    setLines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  }

  function addLine() {
    setLines((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(index: number) {
    setLines((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  }

  function continueToFormalQuote() {
    const cleanedLines = lines
      .filter((line) => line.label.trim().length >= 2 && line.quantity > 0)
      .map((line) => ({
        ...line,
        label: line.label.trim(),
        subCategory: line.subCategory.trim() || undefined,
        total: round2(line.quantity * line.unitPrice)
      }));

    const payload = {
      createdAt: new Date().toISOString(),
      sourceDescription: scope,
      region: "fr_standard",
      detailLevel: "standard",
      quote: {
        title: title.trim(),
        scope: scope.trim(),
        totalExclTax: totals.totalExclTax,
        totalVat: totals.totalVat,
        totalInclTax: totals.totalInclTax,
        lines: cleanedLines
      }
    };

    window.localStorage.setItem("devispro_quote_draft", JSON.stringify(payload));
    router.push("/devis/convertir");
  }

  return (
    <section className="surface-panel p-4">
      <h2 className="text-lg font-semibold">Devis manuel (sans IA)</h2>
      <p className="mt-1 text-sm text-slate-600">Saisis directement tes lignes, puis passe au devis formel.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du devis"
        />
        <input
          className="form-control"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder="Description du chantier"
        />
      </div>

      <div className="table-wrap mt-4">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="table-head-row">
              <th className="py-2">Poste</th>
              <th className="py-2">Sous-categorie</th>
              <th className="py-2">Categorie</th>
              <th className="py-2">Qt</th>
              <th className="py-2">Unite</th>
              <th className="py-2">PU HT</th>
              <th className="py-2">TVA</th>
              <th className="py-2">Total HT</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={`manual-line-${index}`} className="table-row">
                <td className="py-2">
                  <input
                    className="form-control-sm w-full"
                    value={line.label}
                    onChange={(e) => updateLine(index, "label", e.target.value)}
                    placeholder="Ex: Pose parquet"
                  />
                </td>
                <td className="py-2">
                  <input
                    className="form-control-sm w-36"
                    value={line.subCategory}
                    onChange={(e) => updateLine(index, "subCategory", e.target.value)}
                    placeholder="Ex: Pose"
                  />
                </td>
                <td className="py-2">
                  <select
                    className="form-control-sm"
                    value={line.category}
                    onChange={(e) => updateLine(index, "category", e.target.value as ManualLine["category"])}
                  >
                    <option value="materiau">Materiau</option>
                    <option value="main_oeuvre">Main-d&apos;oeuvre</option>
                    <option value="frais">Frais</option>
                  </select>
                </td>
                <td className="py-2">
                  <input
                    className="form-control-sm w-24"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, "quantity", Number(e.target.value) || 0)}
                  />
                </td>
                <td className="py-2">
                  <input
                    className="form-control-sm w-24"
                    value={line.unit}
                    onChange={(e) => updateLine(index, "unit", e.target.value)}
                  />
                </td>
                <td className="py-2">
                  <input
                    className="form-control-sm w-28"
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, "unitPrice", Number(e.target.value) || 0)}
                  />
                </td>
                <td className="py-2">
                  <input
                    className="form-control-sm w-24"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={line.vatRate}
                    onChange={(e) => updateLine(index, "vatRate", Number(e.target.value) || 0)}
                  />
                </td>
                <td className="py-2 font-medium">{round2(line.quantity * line.unitPrice).toFixed(2)} EUR</td>
                <td className="py-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                    onClick={() => removeLine(index)}
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

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={addLine}>
          Ajouter une ligne
        </button>
      </div>

      <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
        <div className="surface-muted">
          <p className="text-slate-500">Total HT</p>
          <p className="font-semibold">{totals.totalExclTax.toFixed(2)} EUR</p>
        </div>
        <div className="surface-muted">
          <p className="text-slate-500">Total TVA</p>
          <p className="font-semibold">{totals.totalVat.toFixed(2)} EUR</p>
        </div>
        <div className="surface-muted">
          <p className="text-slate-500">Total TTC</p>
          <p className="font-semibold">{totals.totalInclTax.toFixed(2)} EUR</p>
        </div>
      </div>

      <div className="mt-4">
        <button type="button" className="btn-primary" disabled={!canContinue} onClick={continueToFormalQuote}>
          Passer en devis formel
        </button>
      </div>
    </section>
  );
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
