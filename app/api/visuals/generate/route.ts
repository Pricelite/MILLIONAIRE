import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY manquante." }, { status: 400 });
    }

    const formData = await request.formData();
    const promptRaw = formData.get("prompt");
    const prompt = typeof promptRaw === "string" ? promptRaw.trim() : "";
    const images = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, 5);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

    let result: Awaited<ReturnType<typeof client.images.generate>> | Awaited<ReturnType<typeof client.images.edit>>;
    if (images.length > 0) {
      result = await client.images.edit({
        model,
        prompt,
        image: images as unknown as never
      });
    } else {
      result = await client.images.generate({
        model,
        prompt,
        size: "1024x1024"
      });
    }

    const first = result.data?.[0];
    const image =
      first?.url ?? (first?.b64_json ? `data:image/png;base64,${first.b64_json}` : null);

    if (!image) {
      return NextResponse.json({ error: "Aucune image generee." }, { status: 500 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generation visuelle impossible"
      },
      { status: 400 }
    );
  }
}

