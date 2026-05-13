import { NextResponse } from "next/server";
import { z } from "zod";
import { generateQuoteWithAI } from "@/lib/ai/quote-generator";

const bodySchema = z.object({
  description: z.string().min(6),
  region: z.enum(["fr_standard", "ile_de_france", "sud_est", "dom_tom"]).default("fr_standard")
});

export async function POST(request: Request) {
  try {
    const payload = bodySchema.parse(await request.json());
    const quote = await generateQuoteWithAI({
      description: payload.description,
      region: payload.region
    });
    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generation impossible"
      },
      { status: 400 }
    );
  }
}

