import OpenAI from "openai";
import { z } from "zod";
import { buildQuotePrompt } from "./prompts";
import { estimateQuoteFromLines } from "@/lib/pricing/estimator";
import { PricingRegion } from "@/lib/pricing/types";
import { researchQuoteContext } from "@/lib/pricing/research";

const quoteSchema = z.object({
  title: z.string().min(3),
  scope: z.string().min(3),
  laborHours: z.number().nonnegative(),
  marginRate: z.number().min(0).max(1),
  lines: z.array(
    z.object({
      code: z.string().optional(),
      label: z.string().min(2),
      quantity: z.number().positive(),
      unit: z.string().min(1),
      category: z.enum(["materiau", "main_oeuvre", "frais"]),
      unitPrice: z.number().nonnegative(),
      vatRate: z.number().min(0).max(1)
    })
  )
});

export async function generateQuoteWithAI(input: { description: string; region: PricingRegion }) {
  const research = await researchQuoteContext(input.description, input.region);
  const defaultMargin = research.trade === "general" ? 0.18 : 0.22;

  if (!process.env.OPENAI_API_KEY) {
    const fallback = estimateQuoteFromLines({
      title: "Devis chantier",
      scope: input.description,
      laborHours: research.suggestedLines
        .filter((line) => line.category === "main_oeuvre")
        .reduce((sum, line) => sum + line.quantity, 0),
      marginRate: defaultMargin,
      region: input.region,
      lines: research.suggestedLines
    });
    return {
      ...fallback,
      assumptions: research.assumptions,
      detectedTrade: research.trade,
      confidence: research.confidence
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = buildQuotePrompt({
    description: input.description,
    region: input.region,
    research: {
      trade: research.trade,
      assumptions: research.assumptions,
      confidence: research.confidence,
      suggestedLines: research.suggestedLines
    }
  });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Tu produis des devis BTP fiables pour la France." },
      { role: "user", content: prompt }
    ]
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = quoteSchema.parse(JSON.parse(content));

  const quote = estimateQuoteFromLines({
    title: parsed.title,
    scope: parsed.scope,
    laborHours: parsed.laborHours,
    marginRate: parsed.marginRate || defaultMargin,
    region: input.region,
    lines: parsed.lines
  });

  return {
    ...quote,
    assumptions: research.assumptions,
    detectedTrade: research.trade,
    confidence: research.confidence
  };
}
