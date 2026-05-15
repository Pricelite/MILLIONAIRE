import { NextResponse } from "next/server";
import { z } from "zod";
import { generateQuoteWithAI } from "@/lib/ai/quote-generator";
import {
  ApiAuthError,
  isApiAuthEnforced,
  requireAuthenticatedUser,
  requireCompanyContext
} from "@/lib/api/auth";

const bodySchema = z.object({
  description: z.string().min(6),
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom"]).default("fr_standard"),
  detailLevel: z.enum(["standard", "expert"]).default("standard")
});

export async function POST(request: Request) {
  try {
    let companyContext: Awaited<ReturnType<typeof requireCompanyContext>> | null = null;
    try {
      companyContext = await requireCompanyContext(request);
    } catch (error) {
      if (isApiAuthEnforced()) {
        throw error;
      }
      await requireAuthenticatedUser(request, { optionalWhenNotEnforced: true });
    }

    const payload = bodySchema.parse(await request.json());
    const quote = await generateQuoteWithAI({
      description: payload.description,
      region: payload.region,
      detailLevel: payload.detailLevel,
      companyId: companyContext?.companyId
    });
    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof ApiAuthError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Generation impossible"
      },
      { status: error instanceof ApiAuthError ? error.status : 400 }
    );
  }
}
