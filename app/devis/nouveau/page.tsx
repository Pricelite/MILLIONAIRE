import { QuoteGeneratorForm } from "@/components/quote-generator-form";
import { ManualQuoteForm } from "@/components/manual-quote-form";
import { PageHeader, PageShell } from "@/components/page-shell";

export default function NewQuotePage() {
  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Nouveau devis IA"
        subtitle="Tu peux generer avec IA ou creer un devis manuel sans IA."
      />
      <section className="surface-panel p-3">
        <QuoteGeneratorForm />
      </section>
      <ManualQuoteForm />
    </PageShell>
  );
}
