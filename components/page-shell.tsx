import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageShellProps = {
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
};

const maxWidthClassMap: Record<NonNullable<PageShellProps["maxWidth"]>, string> = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl"
};

export function PageShell({ children, maxWidth = "6xl" }: PageShellProps) {
  return (
    <main
      className={`print-page mx-auto flex min-h-screen w-full ${maxWidthClassMap[maxWidth]} flex-col gap-5 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.14),_transparent_40%)] p-4 md:p-8`}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Retour dashboard",
  actions
}: PageHeaderProps) {
  return (
    <div className="print:hidden">
      <Link href={backHref} className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      <section className="reveal hover-lift rounded-2xl border border-blue-100 bg-white/85 p-5 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </section>
    </div>
  );
}
