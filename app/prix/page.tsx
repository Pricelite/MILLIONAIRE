"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, PageShell } from "@/components/page-shell";

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
  supplier_name?: string | null;
  product_url?: string | null;
  image_url?: string | null;
  source_updated_at?: string | null;
};

type ImportItem = {
  code: string;
  label: string;
  category: PriceCategory;
  unit: string;
  unitPrice: number;
  vatRate: number;
  region: ImportRegion;
  supplierName?: string;
  productUrl?: string;
  imageUrl?: string;
  sourceUpdatedAt?: string;
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
    vatRate: "0.2",
    supplierName: "",
    productUrl: "",
    imageUrl: "",
    sourceUpdatedAt: ""
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
          region,
          supplierName: form.supplierName.trim() || undefined,
          productUrl: form.productUrl.trim() || undefined,
          imageUrl: form.imageUrl.trim() || undefined,
          sourceUpdatedAt: form.sourceUpdatedAt.trim() || undefined
        })
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Creation impossible");
      }
      setForm({
        code: "",
        label: "",
        category: "materiau",
        unit: "u",
        unitPrice: "0",
        vatRate: "0.2",
        supplierName: "",
        productUrl: "",
        imageUrl: "",
        sourceUpdatedAt: ""
      });
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

  async function clearLibrary() {
    setError(null);
    try {
      const res = await fetch("/api/pricing/library", { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Reinitialisation impossible.");
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
      "code;label;category;unit;unit_price_ht;vat_rate;region;supplier_name;product_url;image_url;source_updated_at",
      "PEINT_MAT;Peinture mate premium;materiau;l;12.9;0.2;fr_standard;Leroy Merlin;https://www.leroymerlin.fr;https://logo.clearbit.com/leroymerlin.fr;2026-05-13",
      "MO_PEINT;Main oeuvre peinture;main_oeuvre;heure;45;0.1;fr_standard;Tarif artisan;;;2026-05-13",
      "DEPLACEMENT;Deplacement chantier;frais;forfait;35;0.2;all;Multi-magasins;;;2026-05-13"
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
    <PageShell maxWidth="6xl">
      <PageHeader
        title="Mes prix"
        subtitle="Cette base de prix est utilisee automatiquement par l'IA pour generer des devis realistes."
        actions={
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="form-control-sm"
          >
            <option value="fr_standard">France standard</option>
            <option value="ile_de_france">Ile-de-France</option>
            <option value="sud_est">Sud-Est</option>
            <option value="dom_tom">DOM-TOM</option>
          </select>
        }
      />

      <section className="surface-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Import CSV / Excel</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={downloadTemplateCsv}>
              Telecharger template CSV
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={loading || importLoading}
              onClick={() => void clearLibrary()}
            >
              Vider la bibliotheque
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Colonnes attendues: `code`, `label`, `category`, `unit`, `unit_price_ht`, `vat_rate`, `region`, `supplier_name`, `product_url`, `image_url`, `source_updated_at`.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="btn-secondary cursor-pointer">
            Choisir un fichier (.csv, .xlsx, .xls)
            <input className="hidden" type="file" accept=".csv,.xlsx,.xls" onChange={onImportFileChange} />
          </label>
          <select
            className="form-control-sm"
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
          <div className="table-wrap mt-3">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="table-head-row bg-slate-50">
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Libelle</th>
                  <th className="px-3 py-2">Categorie</th>
                  <th className="px-3 py-2">Unite</th>
                  <th className="px-3 py-2">Prix HT</th>
                  <th className="px-3 py-2">TVA</th>
                  <th className="px-3 py-2">Region</th>
                  <th className="px-3 py-2">Magasin</th>
                  <th className="px-3 py-2">Photo</th>
                  <th className="px-3 py-2">Lien</th>
                </tr>
              </thead>
              <tbody>
                {importItems.slice(0, 20).map((row, idx) => (
                  <tr key={`${row.code}-${idx}`} className="table-row">
                    <td className="px-3 py-2">{row.code}</td>
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2">{row.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">{Math.round(row.vatRate * 100)}%</td>
                    <td className="px-3 py-2">{row.region}</td>
                    <td className="px-3 py-2">{row.supplierName || "-"}</td>
                    <td className="px-3 py-2">
                      {row.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.imageUrl} alt="photo produit" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {row.productUrl ? (
                        <a href={row.productUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Ouvrir
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
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

      <section className="surface-panel p-5">
        <h2 className="text-lg font-semibold">Ajouter un tarif</h2>
        <form onSubmit={addItem} className="mt-3 grid gap-2 md:grid-cols-6">
          <input
            className="form-control-sm"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
          />
          <input
            className="form-control-sm md:col-span-2"
            placeholder="Libelle"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          />
          <select
            className="form-control-sm"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as PriceCategory }))}
          >
            <option value="materiau">Materiau</option>
            <option value="main_oeuvre">Main-d&apos;oeuvre</option>
            <option value="frais">Frais</option>
          </select>
          <input
            className="form-control-sm"
            placeholder="Unite"
            value={form.unit}
            onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
          />
          <input
            className="form-control-sm"
            type="number"
            min="0"
            step="0.01"
            placeholder="Prix HT"
            value={form.unitPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, unitPrice: e.target.value }))}
          />
          <input
            className="form-control-sm"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="TVA (0.2)"
            value={form.vatRate}
            onChange={(e) => setForm((prev) => ({ ...prev, vatRate: e.target.value }))}
          />
          <input
            className="form-control-sm md:col-span-2"
            placeholder="Magasin / fournisseur"
            value={form.supplierName}
            onChange={(e) => setForm((prev) => ({ ...prev, supplierName: e.target.value }))}
          />
          <input
            className="form-control-sm md:col-span-2"
            placeholder="URL produit"
            value={form.productUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, productUrl: e.target.value }))}
          />
          <input
            className="form-control-sm md:col-span-2"
            placeholder="URL photo"
            value={form.imageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
          />
          <input
            className="form-control-sm md:col-span-2"
            placeholder="Date source (YYYY-MM-DD)"
            value={form.sourceUpdatedAt}
            onChange={(e) => setForm((prev) => ({ ...prev, sourceUpdatedAt: e.target.value }))}
          />
          <button className="btn-primary md:col-span-2" type="submit" disabled={!canSubmit}>
            Ajouter
          </button>
        </form>
      </section>

      <section className="surface-panel p-5">
        <h2 className="text-lg font-semibold">Bibliotheque active</h2>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="table-wrap mt-3">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="table-head-row">
                  <th className="py-2">Code</th>
                  <th className="py-2">Libelle</th>
                  <th className="py-2">Categorie</th>
                  <th className="py-2">Unite</th>
                  <th className="py-2">Prix HT</th>
                  <th className="py-2">TVA</th>
                  <th className="py-2">Magasin</th>
                  <th className="py-2">Photo</th>
                  <th className="py-2">Lien</th>
                  <th className="py-2">MAJ</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="py-2">{item.code}</td>
                    <td className="py-2">{item.label}</td>
                    <td className="py-2">{item.category}</td>
                    <td className="py-2">{item.unit}</td>
                    <td className="py-2">{Number(item.unit_price_ht).toFixed(2)} EUR</td>
                    <td className="py-2">{Math.round(Number(item.vat_rate) * 100)}%</td>
                    <td className="py-2">{item.supplier_name || "-"}</td>
                    <td className="py-2">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt="photo produit" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2">
                      {item.product_url ? (
                        <a href={item.product_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Ouvrir
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2">{item.source_updated_at ? String(item.source_updated_at).slice(0, 10) : "-"}</td>
                    <td className="py-2">
                      <button
                        className="btn-secondary !px-3 !py-1 text-xs"
                        onClick={() => void removeItem(item.id)}
                        type="button"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 ? (
              <p className="border-t border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                Aucun produit/tarif actif. Ajoute ton catalogue fournisseur avec le formulaire ou l&apos;import CSV/Excel.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </PageShell>
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
    const supplierName = getCell(raw, ["supplier_name", "fournisseur", "magasin", "enseigne"]);
    const productUrl = sanitizeOptionalUrl(getCell(raw, ["product_url", "url_produit", "url"]));
    const imageUrl = sanitizeOptionalUrl(getCell(raw, ["image_url", "photo_url", "image", "photo"]));
    const sourceUpdatedAt = sanitizeOptionalDate(getCell(raw, ["source_updated_at", "date_source", "maj_source"]));
    const category = mapCategory(categoryCell);

    if (!code || !label || !category || price === null || vat === null) continue;
    output.push({
      code: code.toUpperCase().slice(0, 64),
      label: label.slice(0, 160),
      category,
      unit: unit.slice(0, 16),
      unitPrice: price,
      vatRate: vat,
      region,
      supplierName: supplierName ? supplierName.slice(0, 120) : undefined,
      productUrl: productUrl || undefined,
      imageUrl: imageUrl || undefined,
      sourceUpdatedAt: sourceUpdatedAt || undefined
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

function sanitizeOptionalUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.toString().slice(0, 500);
  } catch {
    return "";
  }
}

function sanitizeOptionalDate(value: string) {
  if (!value) return "";
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return "";
}
