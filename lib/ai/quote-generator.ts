import OpenAI from "openai";
import { z } from "zod";
import { buildQuotePrompt } from "./prompts";
import { estimateQuoteFromLines } from "@/lib/pricing/estimator";
import { PricingRegion, QuoteLineInput } from "@/lib/pricing/types";
import { researchQuoteContext } from "@/lib/pricing/research";

export type QuoteDetailLevel = "standard" | "expert";

const quoteSchema = z.object({
  title: z.string().min(3),
  scope: z.string().min(3),
  laborHours: z.number().nonnegative(),
  marginRate: z.number().min(0).max(1),
  lines: z.array(
    z.object({
      code: z.string().optional(),
      subCategory: z.string().optional(),
      label: z.string().min(2),
      quantity: z.number().positive(),
      unit: z.string().min(1),
      category: z.enum(["materiau", "main_oeuvre", "frais"]),
      unitPrice: z.number().nonnegative(),
      vatRate: z.number().min(0).max(1)
    })
  )
});

export async function generateQuoteWithAI(input: {
  description: string;
  region: PricingRegion;
  detailLevel?: QuoteDetailLevel;
  companyId?: string;
}) {
  const detailLevel = input.detailLevel ?? "standard";
  const research = await researchQuoteContext(
    input.description,
    input.region,
    detailLevel,
    input.companyId
  );
  const defaultMargin = getDefaultMargin(research.trade, detailLevel);

  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackQuote({
      input,
      research,
      detailLevel,
      defaultMargin,
      reason: "Mode secours: cle OpenAI absente."
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildQuotePrompt({
      description: input.description,
      region: input.region,
      research: {
        trade: research.trade,
        assumptions: research.assumptions,
        confidence: research.confidence,
        suggestedLines: research.suggestedLines,
        detailLevel
      }
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Tu produis des devis BTP fiables pour la France." },
        { role: "user", content: prompt }
      ]
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = quoteSchema.parse(JSON.parse(content));
    const marginRate = normalizeMarginRate(parsed.marginRate, defaultMargin, research.trade);

    const detailedInputLines = ensureDetailedLines(parsed.lines, research.suggestedLines, detailLevel);
    const realisticLines = applyRealismGuardrails(
      detailedInputLines,
      research.trade,
      research.areaM2,
      input.description,
      marginRate,
      detailLevel
    );
    const filteredRealisticLines = stripOptionalLines(realisticLines, input.description);

    const quote = estimateQuoteFromLines({
      title: parsed.title,
      scope: parsed.scope,
      laborHours: filteredRealisticLines
        .filter((line) => line.category === "main_oeuvre")
        .reduce((sum, line) => sum + line.quantity, 0),
      marginRate,
      region: input.region,
      lines: filteredRealisticLines
    });

    return {
      ...quote,
      assumptions: research.assumptions,
      detectedTrade: research.trade,
      confidence: research.confidence
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur OpenAI";
    return buildFallbackQuote({
      input,
      research,
      detailLevel,
      defaultMargin,
      reason: `Mode secours: ${normalizeOpenAIErrorMessage(message)}`
    });
  };
}

function buildFallbackQuote(params: {
  input: { description: string; region: PricingRegion };
  research: Awaited<ReturnType<typeof researchQuoteContext>>;
  detailLevel: QuoteDetailLevel;
  defaultMargin: number;
  reason?: string;
}) {
  const { input, research, detailLevel, defaultMargin, reason } = params;
  const fallbackLines = applyRealismGuardrails(
    research.suggestedLines,
    research.trade,
    research.areaM2,
    input.description,
    defaultMargin,
    detailLevel
  );
  const filteredFallbackLines = stripOptionalLines(fallbackLines, input.description);
  const fallback = estimateQuoteFromLines({
    title: "Devis chantier",
    scope: input.description,
    laborHours: filteredFallbackLines
      .filter((line) => line.category === "main_oeuvre")
      .reduce((sum, line) => sum + line.quantity, 0),
    marginRate: defaultMargin,
    region: input.region,
    lines: filteredFallbackLines
  });
  return {
    ...fallback,
    assumptions: reason ? [...research.assumptions, reason] : research.assumptions,
    detectedTrade: research.trade,
    confidence: research.confidence
  };
}

function normalizeOpenAIErrorMessage(message: string) {
  const text = message.toLowerCase();
  if (text.includes("quota") || text.includes("billing") || text.includes("429")) {
    return "quota OpenAI atteint, generation locale activee";
  }
  if (text.includes("timeout")) {
    return "delai OpenAI depasse, generation locale activee";
  }
  return "indisponibilite OpenAI, generation locale activee";
}

function ensureDetailedLines(
  aiLines: Array<{
    code?: string;
    subCategory?: string;
    label: string;
    quantity: number;
    unit: string;
    category: "materiau" | "main_oeuvre" | "frais";
    unitPrice: number;
    vatRate: number;
  }>,
  suggestedLines: Array<{
    code?: string;
    subCategory?: string;
    label: string;
    quantity: number;
    unit?: string;
    category: "materiau" | "main_oeuvre" | "frais";
    unitPrice?: number;
    vatRate?: number;
  }>,
  detailLevel: QuoteDetailLevel
) {
  const normalizedAiLines = consolidateLines(aiLines);
  const minLines = detailLevel === "expert" ? 20 : 14;
  const hasAllCategories =
    normalizedAiLines.some((line) => line.category === "materiau") &&
    normalizedAiLines.some((line) => line.category === "main_oeuvre") &&
    normalizedAiLines.some((line) => line.category === "frais");

  if (normalizedAiLines.length >= minLines && hasAllCategories) {
    return normalizedAiLines;
  }

  const merged = [...normalizedAiLines];
  const existing = new Set(
    normalizedAiLines.map((line) => buildLineKey(line))
  );

  for (const line of suggestedLines) {
    const key = buildLineKey(line);
    if (existing.has(key)) continue;
    merged.push({
      code: line.code,
      subCategory: line.subCategory,
      label: line.label,
      quantity: line.quantity,
      unit: line.unit ?? "u",
      category: line.category,
      unitPrice: line.unitPrice ?? 0,
      vatRate: line.vatRate ?? 0.2
    });
    existing.add(key);
    const consolidated = consolidateLines(merged);
    if (consolidated.length >= minLines) {
      return consolidated;
    }
  }

  return consolidateLines(merged);
}

function getDefaultMargin(trade: string, detailLevel: QuoteDetailLevel) {
  const standardByTrade: Record<string, number> = {
    general: 0.14,
    carrelage: 0.16,
    peinture: 0.15,
    plomberie: 0.18,
    electricite: 0.18,
    menuiserie: 0.14,
    paysagiste: 0.15
  };
  const base = standardByTrade[trade] ?? 0.15;
  return detailLevel === "expert" ? round2(base + 0.015) : base;
}

function normalizeMarginRate(candidate: number, fallback: number, trade: string) {
  const raw = Number.isFinite(candidate) ? candidate : fallback;
  const byTradeMax: Record<string, number> = {
    menuiserie: 0.18,
    peinture: 0.19,
    carrelage: 0.2,
    plomberie: 0.22,
    electricite: 0.22,
    paysagiste: 0.2,
    general: 0.2
  };
  const max = byTradeMax[trade] ?? 0.2;
  return Math.max(0.08, Math.min(max, round2(raw)));
}

function applyRealismGuardrails(
  lines: QuoteLineInput[],
  trade: string,
  areaM2: number | undefined,
  description: string,
  marginRate: number,
  detailLevel: QuoteDetailLevel
) {
  if (!areaM2 || trade !== "menuiserie") {
    return lines;
  }

  const text = description.toLowerCase();
  const parquetContext = /(parquet|stratifi|contrecoll|massif)/.test(text);
  if (!parquetContext) {
    return lines;
  }

  const priceCapPerM2 = getParquetCapPerM2(text, detailLevel);
  const targetMaxHt = areaM2 * priceCapPerM2;
  const currentSubTotal = lines.reduce((sum, line) => sum + line.quantity * (line.unitPrice ?? 0), 0);
  const currentHt = currentSubTotal * (1 + marginRate);

  if (currentSubTotal <= 0 || currentHt <= targetMaxHt) {
    return lines;
  }

  const targetSubTotal = targetMaxHt / (1 + marginRate);
  const material = sumCategory(lines, "materiau");
  const labor = sumCategory(lines, "main_oeuvre");
  const fees = sumCategory(lines, "frais");

  let targetLabor = labor;
  let targetFees = fees;
  let targetMaterial = material;

  const firstPassLabor = Math.min(labor, Math.max(labor * 0.45, targetSubTotal - material - fees));
  targetLabor = firstPassLabor;
  let subtotalAfterLabor = targetLabor + targetFees + targetMaterial;

  if (subtotalAfterLabor > targetSubTotal) {
    targetFees = Math.min(fees, Math.max(fees * 0.5, targetSubTotal - targetMaterial - targetLabor));
    subtotalAfterLabor = targetLabor + targetFees + targetMaterial;
  }

  if (subtotalAfterLabor > targetSubTotal) {
    targetMaterial = Math.min(material, Math.max(material * 0.85, targetSubTotal - targetLabor - targetFees));
  }

  const laborScale = labor > 0 ? targetLabor / labor : 1;
  const feesScale = fees > 0 ? targetFees / fees : 1;
  const materialScale = material > 0 ? targetMaterial / material : 1;

  return lines.map((line) => {
    const scale =
      line.category === "main_oeuvre" ? laborScale : line.category === "frais" ? feesScale : materialScale;
    return {
      ...line,
      unitPrice: round2((line.unitPrice ?? 0) * scale)
    };
  });
}

function getParquetCapPerM2(text: string, detailLevel: QuoteDetailLevel) {
  if (text.includes("massif")) {
    return detailLevel === "expert" ? 170 : 150;
  }
  if (text.includes("contrecoll")) {
    return detailLevel === "expert" ? 120 : 100;
  }
  if (text.includes("stratif")) {
    return detailLevel === "expert" ? 90 : 75;
  }
  return detailLevel === "expert" ? 115 : 95;
}

function sumCategory(lines: QuoteLineInput[], category: QuoteLineInput["category"]) {
  return lines
    .filter((line) => line.category === category)
    .reduce((sum, line) => sum + line.quantity * (line.unitPrice ?? 0), 0);
}

function buildLineKey(line: {
  code?: string;
  label: string;
  subCategory?: string;
  category: "materiau" | "main_oeuvre" | "frais";
  unit?: string;
  unitPrice?: number;
  vatRate?: number;
}) {
  if (line.code) {
    return `code:${line.code}|cat:${line.category}`;
  }
  return `sub:${(line.subCategory ?? "general").toLowerCase()}|label:${line.label.toLowerCase()}|cat:${line.category}|unit:${
    line.unit ?? "u"
  }|pu:${line.unitPrice ?? 0}|tva:${
    line.vatRate ?? 0.2
  }`;
}

type OptionalLineOptions = {
  includePlinthes: boolean;
  includeLivraison: boolean;
  includeEtudeTech: boolean;
  includeNettoyage: boolean;
};

function detectOptionalLineOptions(text: string): OptionalLineOptions {
  return {
    includePlinthes: /(plinthe|plinthes|avec plinthe|plinthe bois|quart de rond)/i.test(text),
    includeLivraison: /(livraison|approvisionnement|transport)/i.test(text),
    includeEtudeTech: /(etude|metrage|diagnostic|releve)/i.test(text),
    includeNettoyage: /(nettoyage|mise en propre|evacuation|dechets)/i.test(text)
  };
}

function stripOptionalLines(lines: QuoteLineInput[], description: string) {
  const options = detectOptionalLineOptions(description.toLowerCase());
  return lines.filter((line) => {
    const label = line.label.toLowerCase();
    const code = (line.code ?? "").toUpperCase();

    if (!options.includePlinthes) {
      if (code === "PLINTHE_BOIS" || code === "PLINTHE_CARRE") return false;
      if (/(plinthe|quart de rond|seuil)/i.test(label)) return false;
    }
    if (!options.includeLivraison) {
      if (code === "LIVRAISON") return false;
      if (/(livraison|approvisionnement|transport)/i.test(label)) return false;
    }
    if (!options.includeEtudeTech) {
      if (code === "ETUDE_TECH") return false;
      if (/(etude|metrage|releve)/i.test(label)) return false;
    }
    if (!options.includeNettoyage) {
      if (code === "MO_NETTOYAGE") return false;
      if (/(nettoyage|mise en propre|evacuation|dechets)/i.test(label)) return false;
    }

    return true;
  });
}

function consolidateLines<
  T extends {
    code?: string;
    subCategory?: string;
    label: string;
    quantity: number;
    unit: string;
    category: "materiau" | "main_oeuvre" | "frais";
    unitPrice: number;
    vatRate: number;
  }
>(lines: T[]) {
  const map = new Map<string, T>();
  for (const line of lines) {
    const key = buildLineKey(line);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...line });
      continue;
    }
    existing.quantity = round2(existing.quantity + line.quantity);
  }
  return Array.from(map.values());
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
