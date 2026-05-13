"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Region = "fr_standard" | "ile_de_france" | "sud_est" | "dom_tom";
type ImportRegion = Region | "all";
type PriceCategory = "materiau" | "main_oeuvre" | "frais";

type PriceItem = {
  id: string;
  code: string;
  label: string;
  category: PriceCategory;
  unit: string;
  unit_price_ht: number;
  vat_rate: number;
  region: string;
};

type ImportItem = {
  code: string;
  label: string;
  category: PriceCategory;
  unit: string;
  unitPrice: number;
  vatRate: number;
  region: ImportRegion;
};

export default function PricingPage() {
  const [region, setRegion] = useState<Region>("fr_standard");
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    label: "",
    category: "materiau" as PriceCategory,
    unit: "u",
    unitPrice: "0",
    vatRate: "0.2"
  });

  const [importItems, setImportItems] = useState<ImportItem[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [fileName, setFileName] = useState<string>("");

  async function loadItems(nextRegion: Region) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pricing/library?region=${nextRegion}`);
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = (await res.json()) as { items: PriceItem[] };
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems(region);
  }, [region]);

  const canSubmit = useMemo(() => {
    return form.code.trim().length >= 2 && form.label.trim().length >= 2 && Number(form.unitPrice) >= 0;
  }, [form.code, form.label, form.unitPrice]);

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);
    try {
      const res = await fetch("/api/pricing/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          label: form.label.trim(),
          category: form.category,
          unit: form.unit.trim(),
          unitPrice: Number(form.unitPrice),
          vatRate: Number(form.vatRate),
          region
        })
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Creation impossible");
      }
      setForm({ code: "", label: "", category: "materiau", unit: "u", unitPrice: "0", vatRate: "0.2" });
      await loadItems(region);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }

  async function removeItem(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/pricing/library/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      await loadItems(region);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }

  async function onImportFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFileName(file.name);
    setImportError(null);
    try {
      const parsed = await parseImportFile(file, region);
      if (!parsed.length) {
        throw new Error("Aucune ligne exploitable detectee.");
      }
      setImportItems(parsed);
    } catch (e) {
      setImportItems([]);
      setImportError(e instanceof Error ? e.message : "Erreur de lecture du fichier.");
    }
  }

  async function importRowsToDb() {
    if (!importItems.length) return;
    setImportLoading(true);
    setImportError(null);
    try {
      const res = await fetch("/api/pricing/library/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: importMode, items: importItems })
      });
      const data = (await res.json()) as { error?: string; inserted?: number };
      if (!res.ok) throw new Error(data.error || "Import impossible");
      setImportItems([]);
      setFileName("");
      await loadItems(region);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Erreur import.");
    } finally {
      setImportLoading(false);
    }
  }

  function downloadTemplateCsv() {
    const csv = [
      "code;label;category;unit;unit_price_ht;vat_rate;region",
      "PEINT_MAT;Peinture mate premium;materiau;l;12.9;0.2;fr_standard",
      "MO_PEINT;Main oeuvre peinture;main_oeuvre;heure;45;0.1;fr_standard",
      "DEPLACEMENT;Deplacement chantier;frais;forfait;35;0.2;all"
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_tarifs_devispro.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-5 p-4 md:p-8">
      <header className="card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Parametres devis</p>
        <h1 className="mt-1 text-2xl font-bold">Mes prix</h1>
        <p className="mt-1 text-sm text-slate-600">
          Cette base de prix est utilisee automatiquement par l&apos;IA pour generer des devis realistes.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn-secondary" href="/dashboard">
            Retour dashboard
          </Link>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="fr_standard">France standard</option>
            <option value="ile_de_france">Ile-de-France</option>
            <option value="sud_est">Sud-Est</option>
            <option value="dom_tom">DOM-TOM</option>
          </select>
        </div>
      </header>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Import CSV / Excel</h2>
          <button type="button" className="btn-secondary" onClick={downloadTemplateCsv}>
            Telecharger template CSV
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Colonnes attendues: `code`, `label`, `category`, `unit`, `unit_price_ht`, `vat_rate`, `region`.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="btn-secondary cursor-pointer">
            Choisir un fichier (.csv, .xlsx, .xls)
            <input className="hidden" type="file" accept=".csv,.xlsx,.xls" onChange={onImportFileChange} />
          </label>
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={importMode}
            onChange={(e) => setImportMode(e.target.value as "append" | "replace")}
          >
            <option value="append">Mode ajout (conserver existant)</option>
            <option value="replace">Mode remplacement (desactiver existant region)</option>
          </select>
          <button
            type="button"
            className="btn-primary"
            disabled={!importItems.length || importLoading}
            onClick={importRowsToDb}
          >
            {importLoading ? "Import en cours..." : `Importer ${importItems.length} ligne(s)`}
          </button>
        </div>
        {fileName ? <p className="mt-2 text-xs text-slate-500">Fichier: {fileName}</p> : null}
        {importError ? <p className="mt-2 text-sm text-red-600">{importError}</p> : null}

        {importItems.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Libelle</th>
                  <th className="px-3 py-2">Categorie</th>
                  <th className="px-3 py-2">Unite</th>
                  <th className="px-3 py-2">Prix HT</th>
                  <th className="px-3 py-2">TVA</th>
                  <th className="px-3 py-2">Region</th>
                </tr>
              </thead>
              <tbody>
                {importItems.slice(0, 20).map((row, idx) => (
                  <tr key={`${row.code}-${idx}`} className="border-t border-slate-100">
                    <td className="px-3 py-2">{row.code}</td>
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2">{row.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">{Math.round(row.vatRate * 100)}%</td>
                    <td className="px-3 py-2">{row.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {importItems.length > 20 ? (
              <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Apercu limite a 20 lignes sur {importItems.length}.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Ajouter un tarif</h2>
        <form onSubmit={addItem} className="mt-3 grid gap-2 md:grid-cols-6">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Libelle"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          />
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as PriceCategory }))}
          >
            <option value="materiau">Materiau</option>
            <option value="main_oeuvre">Main-d&apos;oeuvre</option>
            <option value="frais">Frais</option>
          </select>
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Unite"
            value={form.unit}
            onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            type="number"
            min="0"
            step="0.01"
            placeholder="Prix HT"
            value={form.unitPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, unitPrice: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="TVA (0.2)"
            value={form.vatRate}
            onChange={(e) => setForm((prev) => ({ ...prev, vatRate: e.target.value }))}
          />
          <button className="btn-primary md:col-span-2" type="submit" disabled={!canSubmit}>
            Ajouter
          </button>
        </form>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Bibliotheque active</h2>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2">Code</th>
                  <th className="py-2">Libelle</th>
                  <th className="py-2">Categorie</th>
                  <th className="py-2">Unite</th>
                  <th className="py-2">Prix HT</th>
                  <th className="py-2">TVA</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2">{item.code}</td>
                    <td className="py-2">{item.label}</td>
                    <td className="py-2">{item.category}</td>
                    <td className="py-2">{item.unit}</td>
                    <td className="py-2">{Number(item.unit_price_ht).toFixed(2)} EUR</td>
                    <td className="py-2">{Math.round(Number(item.vat_rate) * 100)}%</td>
                    <td className="py-2">
                      {!item.id.startsWith("fallback-") ? (
                        <button
                          className="btn-secondary !px-3 !py-1 text-xs"
                          onClick={() => void removeItem(item.id)}
                          type="button"
                        >
                          Supprimer
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Catalogue de base</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

async function parseImportFile(file: File, defaultRegion: Region): Promise<ImportItem[]> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".csv")) {
    const text = await file.text();
    return parseCsvRows(text, defaultRegion);
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    const xlsx = await import("xlsx");
    const wb = xlsx.read(buffer, { type: "array" });
    const firstSheet = wb.SheetNames[0];
    if (!firstSheet) return [];
    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[firstSheet], {
      defval: ""
    });
    return normalizeRows(rows, defaultRegion);
  }
  throw new Error("Format non supporte. Utilise .csv, .xlsx ou .xls.");
}

function parseCsvRows(text: string, defaultRegion: Region): ImportItem[] {
  const clean = text.replace(/\r/g, "").trim();
  if (!clean) return [];
  const lines = clean.split("\n");
  if (lines.length < 2) return [];
  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter).map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = splitCsvLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return normalizeRows(rows, defaultRegion);
}

function detectDelimiter(headerLine: string) {
  if (headerLine.includes(";")) return ";";
  if (headerLine.includes("\t")) return "\t";
  return ",";
}

function splitCsvLine(line: string, delimiter: string) {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === delimiter) {
      out.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  out.push(current);
  return out;
}

function normalizeRows(rows: Record<string, unknown>[], defaultRegion: Region): ImportItem[] {
  const output: ImportItem[] = [];
  for (const raw of rows) {
    const code = getCell(raw, ["code", "ref", "reference", "sku"]);
    const label = getCell(raw, ["label", "libelle", "designation", "nom"]);
    const categoryCell = getCell(raw, ["category", "categorie", "type"]);
    const unit = getCell(raw, ["unit", "unite", "u"]) || "u";
    const price = parseNum(getCell(raw, ["unit_price_ht", "prix_ht", "pu_ht", "prix", "pu"]));
    const vat = parseVat(getCell(raw, ["vat_rate", "tva", "taux_tva"]));
    const region = mapRegion(getCell(raw, ["region", "zone"])) ?? defaultRegion;
    const category = mapCategory(categoryCell);

    if (!code || !label || !category || price === null || vat === null) continue;
    output.push({
      code: code.toUpperCase().slice(0, 64),
      label: label.slice(0, 160),
      category,
      unit: unit.slice(0, 16),
      unitPrice: price,
      vatRate: vat,
      region
    });
  }
  return output;
}

function getCell(raw: Record<string, unknown>, aliases: string[]) {
  const entries = Object.entries(raw);
  for (const alias of aliases) {
    const found = entries.find(([key]) => normalizeKey(key) === normalizeKey(alias));
    if (!found) continue;
    const value = found[1];
    return typeof value === "string" ? value.trim() : String(value ?? "").trim();
  }
  return "";
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parseNum(value: string) {
  if (!value) return null;
  const parsed = Number(value.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100) / 100;
}

function parseVat(value: string) {
  if (!value) return 0.2;
  const clean = value.replace(/\s/g, "").replace(",", ".");
  const percent = clean.endsWith("%");
  const num = Number(percent ? clean.slice(0, -1) : clean);
  if (!Number.isFinite(num) || num < 0) return null;
  const rate = percent || num > 1 ? num / 100 : num;
  if (rate > 1) return null;
  return Math.round(rate * 10000) / 10000;
}

function mapCategory(value: string): PriceCategory | null {
  const v = normalizeKey(value);
  if (!v) return null;
  if (["materiau", "materiaux", "mat", "material"].includes(v)) return "materiau";
  if (["mainoeuvre", "mo", "labor", "mainoeuvreheure"].includes(v)) return "main_oeuvre";
  if (["frais", "forfait", "charge", "charges"].includes(v)) return "frais";
  return null;
}

function mapRegion(value: string): ImportRegion | null {
  const v = normalizeKey(value);
  if (!v) return null;
  if (["frstandard", "france", "standard"].includes(v)) return "fr_standard";
  if (["iledefrance", "idf", "paris"].includes(v)) return "ile_de_france";
  if (["sudest", "sud"].includes(v)) return "sud_est";
  if (["domtom", "dom", "outremer"].includes(v)) return "dom_tom";
  if (["all", "tous", "global"].includes(v)) return "all";
  return null;
}
