import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const patchSchema = z
  .object({
    code: z.string().min(2).max(64).optional(),
    label: z.string().min(2).max(160).optional(),
    category: z.enum(["materiau", "main_oeuvre", "frais"]).optional(),
    unit: z.string().min(1).max(16).optional(),
    unitPrice: z.number().nonnegative().optional(),
    vatRate: z.number().min(0).max(1).optional(),
    region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom", "all"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, "Aucun champ a mettre a jour.");

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Params) {
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

    const client = getSupabaseServerClient();
    const { data, error } = await client
      .from("price_library")
      .update(updateData)
      .eq("id", id)
      .select("id, code, label, category, unit, unit_price_ht, vat_rate, region")
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mise a jour impossible" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: Params) {
  try {
    const { id } = await context.params;
    const client = getSupabaseServerClient();
    const { error } = await client.from("price_library").update({ is_active: false }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suppression impossible" },
      { status: 400 }
    );
  }
}

