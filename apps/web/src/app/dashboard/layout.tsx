import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const enabled = true;
  if (!enabled) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl gap-4 px-4 py-4">
      <DashboardSidebar />
      <section className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">{children}</section>
    </main>
  );
}
