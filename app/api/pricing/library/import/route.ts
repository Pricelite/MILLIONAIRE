import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const importItemSchema = z.object({
  code: z.string().min(2).max(64),
  label: z.string().min(2).max(160),
  category: z.enum(["materiau", "main_oeuvre", "frais"]),
  unit: z.string().min(1).max(16),
  unitPrice: z.number().nonnegative(),
  vatRate: z.number().min(0).max(1),
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).default("fr_standard")
});

const bodySchema = z.object({
  mode: z.enum(["append", "replace"]).default("append"),
  items: z.array(importItemSchema).min(1).max(5000)
});

function chunk<T>(array: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    output.push(array.slice(i, i + size));
  }
  return output;
}

export async function POST(request: Request) {
  try {
    const payload = bodySchema.parse(await request.json());
    const client = getSupabaseServerClient();

    if (payload.mode === "replace") {
      const regions = Array.from(new Set(payload.items.map((item) => item.region)));
      const { error: disableErr } = await client
        .from("price_library")
        .update({ is_active: false })
        .in("region", regions);
      if (disableErr) throw disableErr;
    }

    const rows = payload.items.map((item) => ({
      code: item.code,
      label: item.label,
      category: item.category,
      unit: item.unit,
      unit_price_ht: item.unitPrice,
      vat_rate: item.vatRate,
      region: item.region,
      is_active: true
    }));

    let inserted = 0;
    const packs = chunk(rows, 500);
    for (const pack of packs) {
      const { error } = await client.from("price_library").insert(pack);
      if (error) throw error;
      inserted += pack.length;
    }

    return NextResponse.json({ inserted, mode: payload.mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import impossible" },
      { status: 400 }
    );
  }
}

