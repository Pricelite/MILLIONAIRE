import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCatalogFallback } from "@/lib/pricing/library-server";

const querySchema = z.object({
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom"]).default("fr_standard")
});

const createSchema = z.object({
  code: z.string().min(2).max(64),
  label: z.string().min(2).max(160),
  category: z.enum(["materiau", "main_oeuvre", "frais"]),
  unit: z.string().min(1).max(16),
  unitPrice: z.number().nonnegative(),
  vatRate: z.number().min(0).max(1),
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).default("fr_standard")
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = querySchema.parse({ region: url.searchParams.get("region") ?? "fr_standard" }).region;
  try {
    const client = getSupabaseServerClient();
    const { data, error } = await client
      .from("price_library")
      .select("id, code, label, category, unit, unit_price_ht, vat_rate, region, is_active, created_at")
      .eq("is_active", true)
      .in("region", [region, "all"])
      .order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    return NextResponse.json({ items: data ?? [] });
  } catch {
    const fallback = getCatalogFallback(region).map((item, index) => ({
      id: `fallback-${index}`,
      code: item.code,
      label: item.label,
      category: item.category,
      unit: item.unit,
      unit_price_ht: item.unitPrice,
      vat_rate: item.vatRate,
      region,
      is_active: true
    }));
    return NextResponse.json({ items: fallback, fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = createSchema.parse(await request.json());
    const client = getSupabaseServerClient();
    const { data, error } = await client
      .from("price_library")
      .insert({
        code: payload.code,
        label: payload.label,
        category: payload.category,
        unit: payload.unit,
        unit_price_ht: payload.unitPrice,
        vat_rate: payload.vatRate,
        region: payload.region,
        is_active: true
      })
      .select("id, code, label, category, unit, unit_price_ht, vat_rate, region")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Creation impossible"
      },
      { status: 400 }
    );
  }
}

