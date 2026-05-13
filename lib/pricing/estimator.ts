import { getCatalog } from "./catalog";
import { GeneratedQuote, PricingRegion, QuoteLineInput, QuoteOutputLine } from "./types";

export function estimateQuoteFromLines(input: {
  title: string;
  scope: string;
  lines: QuoteLineInput[];
  laborHours: number;
  marginRate: number;
  region: PricingRegion;
}): GeneratedQuote {
  const catalog = getCatalog(input.region);
  const lines: QuoteOutputLine[] = input.lines.map((line) => {
    const fromCatalog = line.code ? catalog.find((item) => item.code === line.code) : undefined;
    const unitPrice = line.unitPrice ?? fromCatalog?.unitPrice ?? 0;
    const unit = line.unit ?? fromCatalog?.unit ?? "u";
    const vatRate = line.vatRate ?? fromCatalog?.vatRate ?? 0.2;
    return {
      label: line.label,
      quantity: line.quantity,
      unit,
      unitPrice,
      total: round2(line.quantity * unitPrice),
      category: line.category,
      vatRate
    };
  });

  const subTotal = round2(lines.reduce((sum, line) => sum + line.total, 0));
  const marginValue = round2(subTotal * input.marginRate);
  const totalExclTax = round2(subTotal + marginValue);
  const weightedVat = totalExclTax > 0 ? averageVat(lines) : 0.2;
  const totalVat = round2(totalExclTax * weightedVat);
  const totalInclTax = round2(totalExclTax + totalVat);

  const laborCost = round2(lines.filter((line) => line.category === "main_oeuvre").reduce((sum, line) => sum + line.total, 0));
  const materialCost = round2(lines.filter((line) => line.category === "materiau").reduce((sum, line) => sum + line.total, 0));

  return {
    title: input.title,
    scope: input.scope,
    laborHours: input.laborHours,
    laborCost,
    materialCost,
    marginRate: input.marginRate,
    vatRate: weightedVat,
    totalExclTax,
    totalVat,
    totalInclTax,
    lines
  };
}

function averageVat(lines: QuoteOutputLine[]) {
  const base = lines.reduce((sum, line) => sum + line.total, 0);
  if (!base) {
    return 0.2;
  }
  const vat = lines.reduce((sum, line) => sum + line.total * line.vatRate, 0);
  return round2(vat / base);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

