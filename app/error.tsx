"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Erreur interne temporaire</h1>
      <p className="text-sm text-slate-600">
        Une erreur s&apos;est produite pendant la simulation. Reessayez ou rechargez la page.
      </p>
      <p className="text-xs text-slate-500">Detail: {error.message || "Erreur inconnue"}</p>
      <div className="flex gap-2">
        <button type="button" className="btn-primary" onClick={reset}>
          Reessayer
        </button>
        <a className="btn-secondary" href="/dashboard">
          Retour dashboard
        </a>
      </div>
    </main>
  );
}

