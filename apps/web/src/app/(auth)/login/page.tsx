"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { login } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connexion RESTOMASTER</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input name="email" type="email" defaultValue="antoniwelh@gmail.com" required />
            <Input name="password" type="password" defaultValue="Anthony45" required />
            {errorText ? <p className="text-sm text-red-400">{errorText}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
