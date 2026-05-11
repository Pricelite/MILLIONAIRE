"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { login } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setErrorText(null);

    try {
      const session = await login(email, password);
      setSession(session);
      localStorage.setItem("restomaster:accessToken", session.accessToken);
      toast.success("Connexion reussie");
      router.push("/dashboard");
    } catch {
      setErrorText("Connexion impossible. Verifie API et identifiants.");
      toast.error("Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1.2fr_1fr] md:items-center">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-45px_rgba(56,189,248,0.6)] backdrop-blur-xl md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-300">RestoMaster SaaS</p>
        <h1 className="mt-3 text-4xl font-black text-white">Connexion securisee</h1>
        <p className="mt-3 text-zinc-300">Accede a la console operations pour piloter salle, caisse, cuisine, stock et analytics en temps reel.</p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-zinc-400">Email</label>
          <input name="email" type="email" defaultValue="antoniwelh@gmail.com" required className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" />
          <label className="text-xs uppercase tracking-wider text-zinc-400">Mot de passe</label>
          <input name="password" type="password" defaultValue="Anthony45" required className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3 text-sm" />
          {errorText ? <p className="text-sm text-rose-300">{errorText}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-sky-950" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}
