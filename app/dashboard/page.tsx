import Link from "next/link";
import { FileText, Send, Wallet, Clock3 } from "lucide-react";
import { QuoteGeneratorForm } from "@/components/quote-generator-form";

const stats = [
  {
    label: "Devis envoyes (mois)",
    value: "0",
    icon: FileText,
    cardClass: "from-cyan-500/20 to-blue-600/20 border-cyan-200",
    iconClass: "bg-cyan-100 text-cyan-700"
  },
  {
    label: "Taux d'acceptation",
    value: "0%",
    icon: Send,
    cardClass: "from-emerald-500/20 to-lime-500/20 border-emerald-200",
    iconClass: "bg-emerald-100 text-emerald-700"
  },
  {
    label: "CA mensuel",
    value: "0 EUR",
    icon: Wallet,
    cardClass: "from-violet-500/20 to-fuchsia-500/20 border-violet-200",
    iconClass: "bg-violet-100 text-violet-700"
  },
  {
    label: "Paiements en attente",
    value: "0 EUR",
    icon: Clock3,
    cardClass: "from-amber-400/20 to-orange-500/20 border-amber-200",
    iconClass: "bg-amber-100 text-amber-700"
  }
];

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.14),_transparent_40%)] p-4 md:p-8">
      <header className="reveal overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-5 text-white shadow-soft hover-lift">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-100">DevisPro AI</p>
        <h1 className="mt-1 text-3xl font-bold">Decris ton chantier. L&apos;IA cree ton devis.</h1>
        <p className="mt-2 max-w-2xl text-sm text-sky-100">
          Version MVP mobile-first pour artisans. Flux simple: generation IA, envoi, signature, facturation.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn hover-lift rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-sky-50" href="/devis/nouveau">
            Nouveau devis
          </Link>
          <Link className="btn hover-lift rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20" href="/clients">
            Mes clients
          </Link>
          <Link className="btn hover-lift rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20" href="/prix">
            Mes prix
          </Link>
          <Link className="btn hover-lift rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20" href="/clients/ajouter">
            Ajouter un client
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`reveal hover-lift rounded-2xl border bg-gradient-to-br p-4 shadow-soft ${item.cardClass}`}
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${item.iconClass}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-600">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="reveal hover-lift rounded-2xl border border-blue-100 bg-white/85 p-3 backdrop-blur" style={{ animationDelay: "440ms" }}>
        <QuoteGeneratorForm />
      </section>
    </main>
  );
}
