import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseUserClient } from "@/lib/supabase/server";
import { ApiAuthError, isApiAuthEnforced, requireCompanyContext } from "@/lib/api/auth";

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
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).default("fr_standard"),
  supplierName: z.string().max(120).optional(),
  productUrl: z.string().url().max(500).optional(),
  imageUrl: z.string().url().max(500).optional(),
  sourceUpdatedAt: z.string().max(40).optional()
});

function buildInsertPayload(payload: z.infer<typeof createSchema>, companyId: string) {
  return {
    company_id: companyId,
    code: payload.code,
    label: payload.label,
    category: payload.category,
    unit: payload.unit,
    unit_price_ht: payload.unitPrice,
    vat_rate: payload.vatRate,
    region: payload.region,
    supplier_name: payload.supplierName ?? null,
    product_url: payload.productUrl ?? null,
    image_url: payload.imageUrl ?? null,
    source_updated_at: payload.sourceUpdatedAt ?? null,
    is_active: true
  };
}

function stripExtendedColumns<T extends Record<string, unknown>>(row: T) {
  const legacy = { ...row } as Record<string, unknown>;
  delete legacy.supplier_name;
  delete legacy.product_url;
  delete legacy.image_url;
  delete legacy.source_updated_at;
  return legacy;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = querySchema.parse({ region: url.searchParams.get("region") ?? "fr_standard" }).region;
  let context: Awaited<ReturnType<typeof requireCompanyContext>> | null = null;
  try {
    context = await requireCompanyContext(request);
  } catch (error) {
    if (isApiAuthEnforced()) {
      return NextResponse.json(
        { error: error instanceof ApiAuthError ? error.message : "Authentification requise." },
        { status: error instanceof ApiAuthError ? error.status : 401 }
      );
    }
  }

  if (!context) {
    return NextResponse.json({ items: [], fallback: false });
  }

  try {
    const client = getSupabaseUserClient(context.accessToken);
    const { data, error } = await client
      .from("price_library")
      .select(
        "id, code, label, category, unit, unit_price_ht, vat_rate, region, supplier_name, product_url, image_url, source_updated_at, is_active, created_at"
      )
      .eq("company_id", context.companyId)
      .eq("is_active", true)
      .in("region", [region, "all"])
      .order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ items: [], fallback: false });
  }
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
    const payload = createSchema.parse(await request.json());
    const client = getSupabaseUserClient(context.accessToken);
    const insertRow = buildInsertPayload(payload, context.companyId);
    const { data, error } = await client
      .from("price_library")
      .insert(insertRow)
      .select(
        "id, code, label, category, unit, unit_price_ht, vat_rate, region, supplier_name, product_url, image_url, source_updated_at"
      )
      .single();

    if (error) {
      const isMissingColumn =
        typeof error.message === "string" &&
        /column .* does not exist/i.test(error.message);
      if (!isMissingColumn) {
        throw error;
      }
      const legacyRow = stripExtendedColumns(insertRow);
      const { data: legacyData, error: legacyError } = await client
        .from("price_library")
        .insert(legacyRow)
        .select("id, code, label, category, unit, unit_price_ht, vat_rate, region")
        .single();
      if (legacyError) throw legacyError;
      return NextResponse.json({ item: legacyData }, { status: 201 });
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

export async function DELETE(request: Request) {
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
    const url = new URL(request.url);
    const region = z
      .enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"])
      .optional()
      .parse(url.searchParams.get("region") ?? undefined);

    const client = getSupabaseUserClient(context.accessToken);
    let query = client.from("price_library").update({ is_active: false }).eq("company_id", context.companyId);
    if (region) {
      query = query.eq("region", region);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: region
        ? `Catalogue desactive pour la region ${region}.`
        : "Catalogue complet desactive."
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reinitialisation impossible" },
      { status: 400 }
    );
  }
}
