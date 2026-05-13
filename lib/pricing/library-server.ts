import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCatalog } from "./catalog";
import { CatalogItem, PricingRegion } from "./types";

type PriceLibraryRow = {
  id: string;
  code: string;
  label: string;
  category: "materiau" | "main_oeuvre" | "frais";
  unit: string;
  unit_price_ht: number;
  vat_rate: number;
  region: string;
};

export async function getCatalogFromLibrary(region: PricingRegion): Promise<CatalogItem[]> {
  const fallback = getCatalog(region);
  try {
    const client = getSupabaseServerClient();
    const { data, error } = await client
      .from("price_library")
      .select("id, code, label, category, unit, unit_price_ht, vat_rate, region")
      .eq("is_active", true)
      .in("region", [region, "all"])
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    const mapped = (data as PriceLibraryRow[]).map((row) => ({
      code: row.code,
      label: row.label,
      category: row.category,
      unit: row.unit,
      unitPrice: round2(row.unit_price_ht),
      vatRate: row.vat_rate,
      tags: buildTags(row.label, row.category)
    }));

    return mapped;
  } catch {
    return fallback;
  }
}

export function getCatalogFallback(region: PricingRegion): CatalogItem[] {
  return getCatalog(region);
}

function buildTags(label: string, category: string) {
  const words = label
    .toLowerCase()
    .split(/[\s,;:/-]+/)
    .filter((word) => word.length > 2);
  if (!words.includes(category)) words.push(category);
  return words;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

