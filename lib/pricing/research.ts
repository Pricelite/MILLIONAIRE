import { getCatalogFromLibrary } from "./library-server";
import { CatalogItem, PricingRegion, QuoteLineInput } from "./types";

type Trade = "carrelage" | "peinture" | "plomberie" | "electricite" | "menuiserie" | "paysagiste" | "general";

type ResearchResult = {
  trade: Trade;
  confidence: number;
  assumptions: string[];
  areaM2?: number;
  lengthMl?: number;
  room?: string;
  suggestedLines: QuoteLineInput[];
};

const tradeKeywords: Record<Trade, string[]> = {
  carrelage: ["carrelage", "faience", "sol", "joint"],
  peinture: ["peinture", "peindre", "plafond", "mur"],
  plomberie: ["plomberie", "wc", "evier", "lavabo", "douche", "tuyau"],
  electricite: ["electricite", "prise", "tableau", "cable", "luminaire"],
  menuiserie: ["menuiserie", "parquet", "porte", "placard", "bois"],
  paysagiste: ["jardin", "pelouse", "paysage", "terrasse exterieure", "massif"],
  general: []
};

export async function researchQuoteContext(
  description: string,
  region: PricingRegion,
  detailLevel: "standard" | "expert" = "standard",
  companyId?: string
): Promise<ResearchResult> {
  const text = normalize(description);
  const trade = detectTrade(text);
  const catalog = await getCatalogFromLibrary(region, companyId);
  const assumptions: string[] = [];

  const areaM2 = extractQuantity(text, ["m2", "m²"]);
  const lengthMl = extractQuantity(text, ["ml", "m"]);
  const room = detectRoom(text);

  if (!areaM2 && (trade === "carrelage" || trade === "peinture" || trade === "menuiserie")) {
    assumptions.push("Surface non precisee: estimation basee sur 12 m2.");
  }
  if (!lengthMl && (trade === "plomberie" || trade === "electricite")) {
    assumptions.push("Longueur non precisee: estimation basee sur 10 ml.");
  }

  if (!room) {
    assumptions.push("Piece non precisee: application de standards generaux.");
  }
  if (detailLevel === "expert") {
    assumptions.push("Mode detail expert active.");
  }

  const baseArea = areaM2 ?? 12;
  const baseLength = lengthMl ?? 10;

  const suggestedLines = buildSuggestedLines(trade, baseArea, baseLength, catalog);
  const confidence = computeConfidence(description, trade, areaM2, lengthMl);

  return {
    trade,
    confidence,
    assumptions,
    areaM2,
    lengthMl,
    room,
    suggestedLines
  };
}

function buildSuggestedLines(
  trade: Trade,
  area: number,
  length: number,
  catalog: CatalogItem[]
): QuoteLineInput[] {
  const lines: QuoteLineInput[] = [];
  const add = (code: string, quantity: number, category: QuoteLineInput["category"]) => {
    const found = catalog.find((item) => item.code === code);
    if (!found) return;
    lines.push({
      code: found.code,
      label: found.label,
      quantity: round(quantity),
      unit: found.unit,
      unitPrice: found.unitPrice,
      vatRate: found.vatRate,
      category
    });
  };

  if (trade === "carrelage") {
    add("CARRE_60", area * 1.08, "materiau");
    add("COLLE_CARRE", area * 4, "materiau");
    add("JOINT_CARRE", area * 0.35, "materiau");
    add("MO_CARRE", area * 0.8, "main_oeuvre");
  } else if (trade === "peinture") {
    add("SOUS_COUCHE", area / 8, "materiau");
    add("PEINTURE_MUR", area / 6, "materiau");
    add("MO_PEINT", area * 0.45, "main_oeuvre");
  } else if (trade === "plomberie") {
    add("TUBE_CUIVRE", length, "materiau");
    add("RACCORD_PLOMB", Math.max(4, Math.ceil(length / 2)), "materiau");
    add("MO_PLOMB", length * 0.65, "main_oeuvre");
  } else if (trade === "electricite") {
    add("CABLE_ELEC", length * 1.2, "materiau");
    add("PRISE", Math.max(2, Math.ceil(length / 4)), "materiau");
    add("MO_ELEC", length * 0.5, "main_oeuvre");
  } else if (trade === "menuiserie") {
    add("PARQUET", area * 1.08, "materiau");
    add("MO_MENUISERIE", area * 0.55, "main_oeuvre");
  } else if (trade === "paysagiste") {
    add("TERRE_VEGETALE", Math.max(2, area * 0.12), "materiau");
    add("MO_PAYSAGE", area * 0.35, "main_oeuvre");
  } else {
    add("MO_CARRE", 8, "main_oeuvre");
  }

  add("PROTECTION", 1, "frais");
  add("DEPLACEMENT", 1, "frais");

  return lines;
}

function detectTrade(text: string): Trade {
  const scores = Object.entries(tradeKeywords).map(([trade, words]) => {
    const score = words.reduce((sum, word) => (text.includes(word) ? sum + 1 : sum), 0);
    return { trade: trade as Trade, score };
  });
  const top = scores.sort((a, b) => b.score - a.score)[0];
  return top && top.score > 0 ? top.trade : "general";
}

function detectRoom(text: string) {
  const rooms = ["salle de bain", "cuisine", "salon", "chambre", "wc", "terrasse"];
  return rooms.find((room) => text.includes(room));
}

function extractQuantity(text: string, units: string[]) {
  const unitPattern = units.map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(\\d+(?:[\\.,]\\d+)?)\\s*(?:${unitPattern})`, "i");
  const match = text.match(regex);
  if (!match) return undefined;
  const raw = Number(match[1].replace(",", "."));
  return Number.isFinite(raw) ? raw : undefined;
}

function computeConfidence(description: string, trade: Trade, area?: number, length?: number) {
  let score = 0.45;
  if (description.length >= 20) score += 0.15;
  if (trade !== "general") score += 0.2;
  if (area || length) score += 0.2;
  return Math.min(0.98, round(score));
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

