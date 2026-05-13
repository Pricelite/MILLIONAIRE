import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuoteGeneratorForm } from "@/components/quote-generator-form";

export default function NewQuotePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-5 p-4 md:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600">
        <ArrowLeft className="h-4 w-4" />
        Retour dashboard
      </Link>
      <QuoteGeneratorForm />
    </main>
  );
}

