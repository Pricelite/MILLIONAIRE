import { AuthGate } from "@/components/layout/auth-gate";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <main className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-4 px-4 py-4 md:flex-row">
        <DashboardSidebar />
        <section className="w-full rounded-3xl border border-white/15 bg-zinc-950/65 p-4 backdrop-blur-sm md:p-5">
          <DashboardTopbar />
          {children}
        </section>
      </main>
    </AuthGate>
  );
}
