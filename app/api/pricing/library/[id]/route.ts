import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { ApiAuthError, requireCompanyContext } from "@/lib/api/auth";

const patchSchema = z
  .object({
    code: z.string().min(2).max(64).optional(),
    label: z.string().min(2).max(160).optional(),
    category: z.enum(["materiau", "main_oeuvre", "frais"]).optional(),
    unit: z.string().min(1).max(16).optional(),
    unitPrice: z.number().nonnegative().optional(),
    vatRate: z.number().min(0).max(1).optional(),
    region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).optional(),
    supplierName: z.string().max(120).optional(),
    productUrl: z.string().url().max(500).optional(),
    imageUrl: z.string().url().max(500).optional(),
    sourceUpdatedAt: z.string().max(40).optional()
  })
  .refine((data) => Object.keys(data).length > 0, "Aucun champ a mettre a jour.");

function stripExtendedColumns<T extends Record<string, unknown>>(row: T) {
  const legacy = { ...row } as Record<string, unknown>;
  delete legacy.supplier_name;
  delete legacy.product_url;
  delete legacy.image_url;
  delete legacy.source_updated_at;
  return legacy;
}

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Params) {
  let authContext: Awaited<ReturnType<typeof requireCompanyContext>>;
  try {
    authContext = await requireCompanyContext(request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiAuthError ? error.message : "Authentification requise." },
      { status: error instanceof ApiAuthError ? error.status : 401 }
    );
  }

  try {
    const { id } = await context.params;
    const payload = patchSchema.parse(await request.json());

    const updateData: Record<string, string | number> = {};
    if (payload.code !== undefined) updateData.code = payload.code;
    if (payload.label !== undefined) updateData.label = payload.label;
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.unit !== undefined) updateData.unit = payload.unit;
    if (payload.unitPrice !== undefined) updateData.unit_price_ht = payload.unitPrice;
    if (payload.vatRate !== undefined) updateData.vat_rate = payload.vatRate;
    if (payload.region !== undefined) updateData.region = payload.region;
    if (payload.supplierName !== undefined) updateData.supplier_name = payload.supplierName;
    if (payload.productUrl !== undefined) updateData.product_url = payload.productUrl;
    if (payload.imageUrl !== undefined) updateData.image_url = payload.imageUrl;
    if (payload.sourceUpdatedAt !== undefined) updateData.source_updated_at = payload.sourceUpdatedAt;

    const client = getSupabaseUserClient(authContext.accessToken);
    const { data, error } = await client
      .from("price_library")
      .update(updateData)
      .eq("company_id", authContext.companyId)
      .eq("id", id)
      .select(
        "id, code, label, category, unit, unit_price_ht, vat_rate, region, supplier_name, product_url, image_url, source_updated_at"
      )
      .single();

    if (error) {
      const isMissingColumn =
        typeof error.message === "string" &&
        /column .* does not exist/i.test(error.message);
      if (!isMissingColumn) throw error;
      const { data: legacyData, error: legacyError } = await client
        .from("price_library")
        .update(stripExtendedColumns(updateData))
        .eq("company_id", authContext.companyId)
        .eq("id", id)
        .select("id, code, label, category, unit, unit_price_ht, vat_rate, region")
        .single();
      if (legacyError) throw legacyError;
      return NextResponse.json({ item: legacyData });
    }
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mise a jour impossible" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: Params) {
  let authContext: Awaited<ReturnType<typeof requireCompanyContext>>;
  try {
    authContext = await requireCompanyContext(_);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiAuthError ? error.message : "Authentification requise." },
      { status: error instanceof ApiAuthError ? error.status : 401 }
    );
  }

  try {
    const { id } = await context.params;
    const client = getSupabaseUserClient(authContext.accessToken);
    const { error } = await client
      .from("price_library")
      .update({ is_active: false })
      .eq("company_id", authContext.companyId)
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suppression impossible" },
      { status: 400 }
    );
  }
}
