import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { ApiAuthError, requireCompanyContext } from "@/lib/api/auth";

const importItemSchema = z.object({
  code: z.string().min(2).max(64),
  label: z.string().min(2).max(160),
  category: z.enum(["materiau", "main_oeuvre", "frais"]),
  unit: z.string().min(1).max(16),
  unitPrice: z.number().nonnegative(),
  vatRate: z.number().min(0).max(1),
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).default("fr_standard"),
  supplierName: z.string().max(120).optional(),
  productUrl: z.string().url().max(500).optional(),
  imageUrl: z.string().url().max(500).optional(),
  sourceUpdatedAt: z.string().max(40).optional()
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

function stripExtendedColumns<T extends Record<string, unknown>>(row: T) {
  const legacy = { ...row } as Record<string, unknown>;
  delete legacy.supplier_name;
  delete legacy.product_url;
  delete legacy.image_url;
  delete legacy.source_updated_at;
  return legacy;
}

export async function POST(request: Request) {
  let context: Awaited<ReturnType<typeof requireCompanyContext>>;
  try {
    context = await requireCompanyContext(request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiAuthError ? error.message : "Authentification requise." },
      { status: error instanceof ApiAuthError ? error.status : 401 }
    );
  }

  try {
    const payload = bodySchema.parse(await request.json());
    const client = getSupabaseUserClient(context.accessToken);

    if (payload.mode === "replace") {
      const regions = Array.from(new Set(payload.items.map((item) => item.region)));
      const { error: disableErr } = await client
        .from("price_library")
        .update({ is_active: false })
        .eq("company_id", context.companyId)
        .in("region", regions);
      if (disableErr) throw disableErr;
    }

    const rows = payload.items.map((item) => ({
      company_id: context.companyId,
      code: item.code,
      label: item.label,
      category: item.category,
      unit: item.unit,
      unit_price_ht: item.unitPrice,
      vat_rate: item.vatRate,
      region: item.region,
      supplier_name: item.supplierName ?? null,
      product_url: item.productUrl ?? null,
      image_url: item.imageUrl ?? null,
      source_updated_at: item.sourceUpdatedAt ?? null,
      is_active: true
    }));

    let inserted = 0;
    const packs = chunk(rows, 500);
    for (const pack of packs) {
      const { error } = await client.from("price_library").insert(pack);
      if (error) {
        const isMissingColumn =
          typeof error.message === "string" &&
          /column .* does not exist/i.test(error.message);
        if (!isMissingColumn) throw error;
        const legacyPack = pack.map((row) => stripExtendedColumns(row));
        const { error: legacyError } = await client.from("price_library").insert(legacyPack);
        if (legacyError) throw legacyError;
      }
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
