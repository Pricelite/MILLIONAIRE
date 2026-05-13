export type PricingRegion = "fr_standard" | "ile_de_france" | "sud_est" | "dom_tom";

export type CatalogItem = {
  code: string;
  label: string;
  category: "materiau" | "main_oeuvre" | "frais";
  unit: string;
  unitPrice: number;
  vatRate: number;
  tags: string[];
};

export type QuoteLineInput = {
  code?: string;
  label: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  category: "materiau" | "main_oeuvre" | "frais";
  vatRate?: number;
};

export type QuoteOutputLine = {
  label: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: "materiau" | "main_oeuvre" | "frais";
  vatRate: number;
};

export type GeneratedQuote = {
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
  lines: QuoteOutputLine[];
  assumptions?: string[];
  detectedTrade?: string;
  confidence?: number;
};
