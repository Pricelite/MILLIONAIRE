import { cn } from "./cn";

type ProgressRowProps = {
  label: string;
  value: string;
  percent: number;
  danger?: boolean;
};

export function ProgressRow({ label, value, percent, danger = false }: ProgressRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-200">{label}</span>
        <span className="text-zinc-400">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800/80">
        <div
          className={cn(
            "h-full rounded-full",
            danger ? "bg-gradient-to-r from-rose-500 to-amber-400" : "bg-gradient-to-r from-sky-500 to-cyan-400"
          )}
          style={{ width: `${Math.max(3, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
