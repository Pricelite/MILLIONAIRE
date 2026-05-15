import Link from "next/link";
import { Home } from "lucide-react";

export function TopRightHomeButton() {
  return (
    <div className="fixed right-4 top-4 z-50 print:hidden">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-50"
      >
        <Home className="h-4 w-4" />
        Accueil
      </Link>
    </div>
  );
}
