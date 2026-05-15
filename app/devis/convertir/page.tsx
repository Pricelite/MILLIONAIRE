"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer, X } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-shell";

type DraftLine = {
  label: string;
  subCategory?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  vatRate: number;
  category: "materiau" | "main_oeuvre" | "frais";
};

type DraftQuote = {
  title: string;
  scope: string;
  totalExclTax: number;
  totalVat: number;
  totalInclTax: number;
  lines: DraftLine[];
};

type DraftPayload = {
  createdAt: string;
  sourceDescription: string;
  region: string;
  quote: DraftQuote;
};

type CompanyForm = {
  companyName: string;
  legalForm: string;
  capital: string;
  siret: string;
  vatNumber: string;
  rmRcs: string;
  address: string;
  email: string;
  phone: string;
  insurer: string;
  policyNumber: string;
  insuranceArea: string;
};

type ClientForm = {
  clientName: string;
  clientAddress: string;
  chantierAddress: string;
  clientEmail: string;
  clientPhone: string;
};

type TermsForm = {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  startDate: string;
  estimatedDurationDays: string;
  depositPercent: string;
  paymentDelayDays: string;
  latePenaltyRate: string;
  paymentTerms: string;
  include293B: boolean;
  includeB2BRecovery: boolean;
};

const defaultCompany: CompanyForm = {
  companyName: "",
  legalForm: "SASU",
  capital: "",
  siret: "",
  vatNumber: "",
  rmRcs: "",
  address: "",
  email: "",
  phone: "",
  insurer: "",
  policyNumber: "",
  insuranceArea: "France metropolitaine"
};

const defaultClient: ClientForm = {
  clientName: "",
  clientAddress: "",
  chantierAddress: "",
  clientEmail: "",
  clientPhone: ""
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildQuoteNumber() {
  const now = new Date();
  const yy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `DV-${yy}${mm}${dd}-${rand}`;
}

function formatEur(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default function ConvertToQuotePage() {
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [quoteLines, setQuoteLines] = useState<DraftLine[]>([]);
  const [newLine, setNewLine] = useState({
    label: "",
    quantity: "1",
    unit: "u",
    unitPrice: "0",
    vatRate: "0.2",
    category: "materiau" as DraftLine["category"]
  });
  const [company, setCompany] = useState<CompanyForm>(defaultCompany);
  const [client, setClient] = useState<ClientForm>(defaultClient);
  const [terms, setTerms] = useState<TermsForm>({
    quoteNumber: buildQuoteNumber(),
    issueDate: todayIso(),
    validUntil: plusDaysIso(30),
    startDate: plusDaysIso(7),
    estimatedDurationDays: "5",
    depositPercent: "30",
    paymentDelayDays: "30",
    latePenaltyRate: "12.0",
    paymentTerms: "Acompte a la commande, solde a reception de facture.",
    include293B: false,
    includeB2BRecovery: true
  });

  useEffect(() => {
    const raw = window.localStorage.getItem("devispro_quote_draft");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DraftPayload;
      if (parsed?.quote?.lines?.length) {
        setDraft(parsed);
        setQuoteLines(
          parsed.quote.lines.map((line) => ({
            ...line,
            quantity: Number(line.quantity) || 0,
            unitPrice: Number(line.unitPrice) || 0,
            vatRate: Number(line.vatRate) || 0.2,
            total: round2((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0))
          }))
        );
      }
    } catch {
      // ignore invalid draft
    }
  }, []);

  const vatBreakdown = useMemo(() => {
    if (!draft) return [];
    const map = new Map<number, { base: number; vat: number }>();
    for (const line of quoteLines) {
      const rate = line.vatRate ?? 0.2;
      const current = map.get(rate) ?? { base: 0, vat: 0 };
      const total = lineTotal(line);
      current.base += total;
      current.vat += total * rate;
      map.set(rate, current);
    }
    return Array.from(map.entries())
      .map(([rate, values]) => ({
        rate,
        base: round2(values.base),
        vat: round2(values.vat)
      }))
      .sort((a, b) => a.rate - b.rate);
  }, [draft, quoteLines]);

  const totals = useMemo(() => {
    if (!draft) return null;
    const ht = round2(quoteLines.reduce((sum, line) => sum + lineTotal(line), 0));
    const vat = round2(vatBreakdown.reduce((sum, row) => sum + row.vat, 0));
    const ttc = round2(ht + vat);
    const deposit = round2((ttc * Number(terms.depositPercent || 0)) / 100);
    return { ht, vat, ttc, deposit };
  }, [draft, quoteLines, terms.depositPercent, vatBreakdown]);

  function updateCompany<K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) {
    setCompany((prev) => ({ ...prev, [key]: value }));
  }

  function updateClient<K extends keyof ClientForm>(key: K, value: ClientForm[K]) {
    setClient((prev) => ({ ...prev, [key]: value }));
  }

  function updateTerms<K extends keyof TermsForm>(key: K, value: TermsForm[K]) {
    setTerms((prev) => ({ ...prev, [key]: value }));
  }

  function updateQuoteLine<K extends keyof DraftLine>(index: number, key: K, value: DraftLine[K]) {
    setQuoteLines((prev) => {
      const next = [...prev];
      const line = { ...next[index], [key]: value };
      line.total = lineTotal(line);
      next[index] = line;
      return next;
    });
  }

  function removeQuoteLine(index: number) {
    setQuoteLines((prev) => prev.filter((_, idx) => idx !== index));
  }

  function addQuoteLine() {
    const label = newLine.label.trim();
    const quantity = Number(newLine.quantity);
    const unitPrice = Number(newLine.unitPrice);
    const vatRate = Number(newLine.vatRate);
    if (!label || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) return;
    const line: DraftLine = {
      label,
      quantity,
      unit: newLine.unit.trim() || "u",
      unitPrice,
      vatRate: Number.isFinite(vatRate) && vatRate >= 0 && vatRate <= 1 ? vatRate : 0.2,
      category: newLine.category,
      total: round2(quantity * unitPrice)
    };
    setQuoteLines((prev) => [...prev, line]);
    setNewLine({
      label: "",
      quantity: "1",
      unit: "u",
      unitPrice: "0",
      vatRate: "0.2",
      category: "materiau"
    });
  }

  function saveDraft() {
    if (!draft) return;
    const updatedDraft: DraftPayload = {
      ...draft,
      quote: {
        ...draft.quote,
        lines: quoteLines.map((line) => ({
          ...line,
          total: lineTotal(line)
        })),
        totalExclTax: totals?.ht ?? 0,
        totalVat: totals?.vat ?? 0,
        totalInclTax: totals?.ttc ?? 0
      }
    };
    const payload = { draft: updatedDraft, company, client, terms, savedAt: new Date().toISOString() };
    window.localStorage.setItem("devispro_formal_quote", JSON.stringify(payload));
  }

  if (!draft) {
    return (
      <PageShell maxWidth="4xl">
        <PageHeader title="Passer en devis" subtitle="Preparation du devis formel a partir d'une proposition generee." />
        <section className="surface-panel p-5">
          <h1 className="text-xl font-bold">Aucune proposition chiffree trouvee</h1>
          <p className="mt-2 text-sm text-slate-600">
            Genere d&apos;abord une proposition, puis clique sur &quot;Passer en devis&quot;.
          </p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="6xl">
      <PageHeader
        title="Passage en devis formel"
        subtitle="Complete les champs juridiques et commerciaux. Le document est prepare pour un devis en contexte francais."
        actions={
          <>
            <button type="button" onClick={saveDraft} className="btn-secondary">
              Sauvegarder brouillon devis
            </button>
            <button type="button" onClick={() => window.print()} className="btn-primary inline-flex gap-2">
              <Printer className="h-4 w-4" />
              Imprimer devis
            </button>
          </>
        }
      />

      <section className="surface-panel p-5 print:hidden">
        <h2 className="text-lg font-semibold">Identite entreprise</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input className="form-control-sm" placeholder="Raison sociale *" value={company.companyName} onChange={(e) => updateCompany("companyName", e.target.value)} />
          <input className="form-control-sm" placeholder="Forme juridique (SAS, SARL...)" value={company.legalForm} onChange={(e) => updateCompany("legalForm", e.target.value)} />
          <input className="form-control-sm" placeholder="Capital social" value={company.capital} onChange={(e) => updateCompany("capital", e.target.value)} />
          <input className="form-control-sm" placeholder="SIRET *" value={company.siret} onChange={(e) => updateCompany("siret", e.target.value)} />
          <input className="form-control-sm" placeholder="TVA intracommunautaire" value={company.vatNumber} onChange={(e) => updateCompany("vatNumber", e.target.value)} />
          <input className="form-control-sm" placeholder="Immatriculation RM/RCS" value={company.rmRcs} onChange={(e) => updateCompany("rmRcs", e.target.value)} />
          <input className="form-control-sm md:col-span-2" placeholder="Adresse entreprise *" value={company.address} onChange={(e) => updateCompany("address", e.target.value)} />
          <input className="form-control-sm" placeholder="Email entreprise" value={company.email} onChange={(e) => updateCompany("email", e.target.value)} />
          <input className="form-control-sm" placeholder="Telephone entreprise" value={company.phone} onChange={(e) => updateCompany("phone", e.target.value)} />
          <input className="form-control-sm" placeholder="Assureur decennale (si BTP)" value={company.insurer} onChange={(e) => updateCompany("insurer", e.target.value)} />
          <input className="form-control-sm" placeholder="Numero police decennale" value={company.policyNumber} onChange={(e) => updateCompany("policyNumber", e.target.value)} />
          <input className="form-control-sm md:col-span-2" placeholder="Zone geographique couverte assurance" value={company.insuranceArea} onChange={(e) => updateCompany("insuranceArea", e.target.value)} />
        </div>
      </section>

      <section className="surface-panel p-5 print:hidden">
        <h2 className="text-lg font-semibold">Client et chantier</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input className="form-control-sm" placeholder="Nom client / raison sociale *" value={client.clientName} onChange={(e) => updateClient("clientName", e.target.value)} />
          <input className="form-control-sm" placeholder="Email client" value={client.clientEmail} onChange={(e) => updateClient("clientEmail", e.target.value)} />
          <input className="form-control-sm" placeholder="Telephone client" value={client.clientPhone} onChange={(e) => updateClient("clientPhone", e.target.value)} />
          <input className="form-control-sm md:col-span-2" placeholder="Adresse facturation client *" value={client.clientAddress} onChange={(e) => updateClient("clientAddress", e.target.value)} />
          <input className="form-control-sm md:col-span-2" placeholder="Adresse chantier (si differente)" value={client.chantierAddress} onChange={(e) => updateClient("chantierAddress", e.target.value)} />
        </div>
      </section>

      <section className="surface-panel p-5 print:hidden">
        <h2 className="text-lg font-semibold">Cadre du devis</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input className="form-control-sm" placeholder="Numero devis" value={terms.quoteNumber} onChange={(e) => updateTerms("quoteNumber", e.target.value)} />
          <input className="form-control-sm" type="date" value={terms.issueDate} onChange={(e) => updateTerms("issueDate", e.target.value)} />
          <input className="form-control-sm" type="date" value={terms.validUntil} onChange={(e) => updateTerms("validUntil", e.target.value)} />
          <input className="form-control-sm" type="date" value={terms.startDate} onChange={(e) => updateTerms("startDate", e.target.value)} />
          <input className="form-control-sm" placeholder="Duree estimee (jours)" value={terms.estimatedDurationDays} onChange={(e) => updateTerms("estimatedDurationDays", e.target.value)} />
          <input className="form-control-sm" placeholder="Acompte (%)" value={terms.depositPercent} onChange={(e) => updateTerms("depositPercent", e.target.value)} />
          <input className="form-control-sm" placeholder="Delai paiement (jours)" value={terms.paymentDelayDays} onChange={(e) => updateTerms("paymentDelayDays", e.target.value)} />
          <input className="form-control-sm" placeholder="Penalites retard (%)" value={terms.latePenaltyRate} onChange={(e) => updateTerms("latePenaltyRate", e.target.value)} />
          <label className="flex items-center gap-2 form-control-sm">
            <input type="checkbox" checked={terms.includeB2BRecovery} onChange={(e) => updateTerms("includeB2BRecovery", e.target.checked)} />
            Indemnite forfaitaire recouvrement 40 EUR (B2B)
          </label>
          <label className="flex items-center gap-2 form-control-sm md:col-span-3">
            <input type="checkbox" checked={terms.include293B} onChange={(e) => updateTerms("include293B", e.target.checked)} />
            TVA non applicable, article 293 B du CGI (micro-entreprise en franchise)
          </label>
          <textarea className="min-h-20 form-control-sm md:col-span-3" placeholder="Conditions de paiement" value={terms.paymentTerms} onChange={(e) => updateTerms("paymentTerms", e.target.value)} />
        </div>
      </section>

      <section className="surface-panel p-5 print:hidden">
        <h2 className="text-xl font-bold">DEVIS {terms.quoteNumber}</h2>
        <p className="text-sm text-slate-600">
          Date d&apos;emission: {terms.issueDate} - Validite jusqu&apos;au: {terms.validUntil}
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-semibold">Entreprise</p>
            <p>{company.companyName || "-"}</p>
            <p>{company.legalForm || "-"}</p>
            <p>{company.address || "-"}</p>
            <p>SIRET: {company.siret || "-"}</p>
            <p>TVA: {company.vatNumber || "-"}</p>
            <p>RM/RCS: {company.rmRcs || "-"}</p>
            <p>Email: {company.email || "-"}</p>
            <p>Tel: {company.phone || "-"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-semibold">Client</p>
            <p>{client.clientName || "-"}</p>
            <p>{client.clientAddress || "-"}</p>
            <p>Chantier: {client.chantierAddress || client.clientAddress || "-"}</p>
            <p>Email: {client.clientEmail || "-"}</p>
            <p>Tel: {client.clientPhone || "-"}</p>
          </div>
        </div>

        <p className="mt-4 text-sm">
          <span className="font-semibold">Objet:</span> {draft.quote.title}
        </p>
        <p className="text-sm text-slate-600">{draft.quote.scope}</p>

        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <p className="text-sm font-semibold">Ajouter une ligne au devis</p>
          <div className="mt-2 grid gap-2 md:grid-cols-7">
            <input
              className="form-control-sm md:col-span-2"
              placeholder="Description"
              value={newLine.label}
              onChange={(e) => setNewLine((prev) => ({ ...prev, label: e.target.value }))}
            />
            <input
              className="form-control-sm"
              type="number"
              min="0.001"
              step="0.001"
              placeholder="Qt"
              value={newLine.quantity}
              onChange={(e) => setNewLine((prev) => ({ ...prev, quantity: e.target.value }))}
            />
            <input
              className="form-control-sm"
              placeholder="Unite"
              value={newLine.unit}
              onChange={(e) => setNewLine((prev) => ({ ...prev, unit: e.target.value }))}
            />
            <input
              className="form-control-sm"
              type="number"
              min="0"
              step="0.01"
              placeholder="PU HT"
              value={newLine.unitPrice}
              onChange={(e) => setNewLine((prev) => ({ ...prev, unitPrice: e.target.value }))}
            />
            <input
              className="form-control-sm"
              type="number"
              min="0"
              max="1"
              step="0.01"
              placeholder="TVA"
              value={newLine.vatRate}
              onChange={(e) => setNewLine((prev) => ({ ...prev, vatRate: e.target.value }))}
            />
            <select
              className="form-control-sm"
              value={newLine.category}
              onChange={(e) => setNewLine((prev) => ({ ...prev, category: e.target.value as DraftLine["category"] }))}
            >
              <option value="materiau">Materiau</option>
              <option value="main_oeuvre">Main-d&apos;oeuvre</option>
              <option value="frais">Frais</option>
            </select>
          </div>
          <button type="button" className="btn-primary mt-2" onClick={addQuoteLine}>
            Ajouter la ligne
          </button>
        </div>

        <div className="table-wrap mt-3">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="table-head-row">
                <th className="py-2">Description</th>
                <th className="py-2">Sous-categorie</th>
                <th className="py-2">Qt</th>
                <th className="py-2">Unite</th>
                <th className="py-2">PU HT</th>
                <th className="py-2">TVA</th>
                <th className="py-2">Total HT</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {quoteLines.map((line, idx) => (
                <tr key={`${line.label}-${idx}`} className="table-row">
                  <td className="py-2">
                    <input
                      className="w-full form-control-sm rounded-lg !px-2 !py-1"
                      value={line.label}
                      onChange={(e) => updateQuoteLine(idx, "label", e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-32 form-control-sm rounded-lg !px-2 !py-1"
                      value={line.subCategory ?? ""}
                      onChange={(e) => updateQuoteLine(idx, "subCategory", e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-24 form-control-sm rounded-lg !px-2 !py-1"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={line.quantity}
                      onChange={(e) => updateQuoteLine(idx, "quantity", Number(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-24 form-control-sm rounded-lg !px-2 !py-1"
                      value={line.unit}
                      onChange={(e) => updateQuoteLine(idx, "unit", e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-28 form-control-sm rounded-lg !px-2 !py-1"
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(e) => updateQuoteLine(idx, "unitPrice", Number(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-20 form-control-sm rounded-lg !px-2 !py-1"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={line.vatRate}
                      onChange={(e) => updateQuoteLine(idx, "vatRate", Number(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-2">{formatEur(lineTotal(line))}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                      onClick={() => removeQuoteLine(idx)}
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

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-semibold">Detail TVA par taux</p>
            {vatBreakdown.map((row) => (
              <p key={row.rate}>
                TVA {Math.round(row.rate * 100)}% - Base {formatEur(row.base)} - Montant {formatEur(row.vat)}
              </p>
            ))}
            {terms.include293B ? <p className="mt-2 font-semibold">TVA non applicable, art. 293 B du CGI.</p> : null}
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p>Sous-total HT: {formatEur(totals?.ht ?? 0)}</p>
            <p>Total TVA: {formatEur(totals?.vat ?? 0)}</p>
            <p className="text-lg font-bold">Total TTC: {formatEur(totals?.ttc ?? 0)}</p>
            <p>Acompte ({terms.depositPercent}%): {formatEur(totals?.deposit ?? 0)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-semibold">Conditions et delais</p>
          <p>Debut previsionnel des travaux: {terms.startDate}</p>
          <p>Duree estimee: {terms.estimatedDurationDays} jour(s)</p>
          <p>Delai de paiement: {terms.paymentDelayDays} jour(s)</p>
          <p>Penalites de retard: {terms.latePenaltyRate}% annuel.</p>
          {terms.includeB2BRecovery ? <p>Indemnite forfaitaire de recouvrement: 40 EUR (B2B).</p> : null}
          <p>{terms.paymentTerms}</p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-semibold">Mentions complementaires BTP</p>
          <p>
            Assurance decennale: {company.insurer || "-"} - Police: {company.policyNumber || "-"} - Zone:{" "}
            {company.insuranceArea || "-"}
          </p>
          <p className="mt-2">
            Bon pour accord. Date, nom, signature client precedee de la mention manuscrite &quot;Lu et approuve&quot;.
          </p>
        </div>
      </section>

      <section className="hidden print:block">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">DevisPro AI</p>
              <h1 className="text-2xl font-bold text-slate-900">DEVIS {terms.quoteNumber}</h1>
              <p className="mt-1 text-sm text-slate-600">Date d&apos;emission: {terms.issueDate}</p>
              <p className="text-sm text-slate-600">Validite: {terms.validUntil}</p>
            </div>
            <div className="text-right text-sm text-slate-700">
              <p className="font-semibold">{company.companyName || "-"}</p>
              <p>{company.legalForm || "-"}</p>
              <p>{company.address || "-"}</p>
              <p>SIRET: {company.siret || "-"}</p>
              <p>TVA: {company.vatNumber || "-"}</p>
              <p>Tel: {company.phone || "-"}</p>
              <p>Email: {company.email || "-"}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">Client</p>
              <p>{client.clientName || "-"}</p>
              <p>{client.clientAddress || "-"}</p>
              <p>Chantier: {client.chantierAddress || client.clientAddress || "-"}</p>
              <p>Tel: {client.clientPhone || "-"}</p>
              <p>Email: {client.clientEmail || "-"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">Objet</p>
              <p>{draft.quote.title}</p>
              <p className="mt-1 text-slate-600">{draft.quote.scope}</p>
              <p className="mt-3">
                Debut previsionnel: <span className="font-medium">{terms.startDate}</span>
              </p>
              <p>
                Duree estimee: <span className="font-medium">{terms.estimatedDurationDays} jour(s)</span>
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Qt</th>
                  <th className="px-3 py-2">Unite</th>
                  <th className="px-3 py-2">PU HT</th>
                  <th className="px-3 py-2">TVA</th>
                  <th className="px-3 py-2 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {quoteLines.map((line, idx) => (
                  <tr key={`print-line-${idx}`} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{line.label}</p>
                      {line.subCategory ? <p className="text-xs text-slate-500">{line.subCategory}</p> : null}
                    </td>
                    <td className="px-3 py-2">{line.quantity}</td>
                    <td className="px-3 py-2">{line.unit}</td>
                    <td className="px-3 py-2">{formatEur(line.unitPrice)}</td>
                    <td className="px-3 py-2">{Math.round(line.vatRate * 100)}%</td>
                    <td className="px-3 py-2 text-right font-medium">{formatEur(lineTotal(line))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">Detail TVA</p>
              {vatBreakdown.map((row) => (
                <p key={`print-vat-${row.rate}`}>
                  TVA {Math.round(row.rate * 100)}% - Base {formatEur(row.base)} - Montant {formatEur(row.vat)}
                </p>
              ))}
              {terms.include293B ? <p className="mt-2 font-semibold">TVA non applicable, article 293 B du CGI.</p> : null}
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p>Sous-total HT: {formatEur(totals?.ht ?? 0)}</p>
              <p>Total TVA: {formatEur(totals?.vat ?? 0)}</p>
              <p className="text-lg font-bold">Total TTC: {formatEur(totals?.ttc ?? 0)}</p>
              <p>Acompte ({terms.depositPercent}%): {formatEur(totals?.deposit ?? 0)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-semibold text-slate-900">Conditions de paiement</p>
            <p>{terms.paymentTerms}</p>
            <p>Delai de paiement: {terms.paymentDelayDays} jour(s)</p>
            <p>Penalites retard: {terms.latePenaltyRate}% annuel</p>
            {terms.includeB2BRecovery ? <p>Indemnite forfaitaire de recouvrement: 40 EUR (B2B).</p> : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-900">Signature entreprise</p>
              <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">Nom, date, signature</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-900">Bon pour accord client</p>
              <div className="mt-10 border-t border-slate-300 pt-2 text-slate-500">
                Lu et approuve, nom, date, signature
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function lineTotal(line: Pick<DraftLine, "quantity" | "unitPrice">) {
  return round2((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0));
}



