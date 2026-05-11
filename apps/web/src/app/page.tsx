import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-5xl font-black">RESTOMASTER</h1>
      <p className="max-w-xl text-zinc-300">Nouvelle base propre v2 prete pour SaaS multi-restaurants.</p>
      <Link href="/login" className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black">
        Se connecter
      </Link>
    </main>
  );
}
