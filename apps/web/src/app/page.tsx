import Link from "next/link";

const features = [
  "Dashboard live",
  "Gestion tables tactile",
  "POS ultra rapide",
  "Suivi cuisine temps reel",
  "Reservations intelligentes",
  "Analytics avances"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-4">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-45px_rgba(56,189,248,0.6)] backdrop-blur-xl md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-300">SaaS restaurant premium</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black text-white md:text-6xl">RESTOMASTER Control Center</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">Pilotage complet salle, caisse, cuisine et stock avec une UX tactile fluide pour les services a fort volume.</p>

        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200">
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-sky-950">
            Acceder a la console
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-white/15 bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-100">
            Demo dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
