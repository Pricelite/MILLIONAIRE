import { NextResponse } from "next/server";

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    {
      error: "Import seed desactive. Chaque entreprise doit integrer son propre catalogue fournisseur."
    },
    { status: 410 }
  );
}
