import { cn } from "./cn";

type StatusBadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClass: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "border-zinc-500/45 bg-zinc-500/14 text-zinc-100",
  success: "border-emerald-500/45 bg-emerald-500/14 text-emerald-200",
  warning: "border-amber-500/45 bg-amber-500/16 text-amber-200",
  danger: "border-rose-500/45 bg-rose-500/16 text-rose-200",
  info: "border-sky-500/45 bg-sky-500/16 text-sky-200"
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide", toneClass[tone])}>
      {label}
    </span>
  );
}
