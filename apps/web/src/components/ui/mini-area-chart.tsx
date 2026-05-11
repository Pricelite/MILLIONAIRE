import { cn } from "./cn";

type MiniAreaChartProps = {
  values: number[];
  labels?: string[];
  className?: string;
};

export function MiniAreaChart({ values, labels = [], className }: MiniAreaChartProps) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={cn("space-y-3", className)}>
      <svg viewBox="0 0 100 100" className="h-44 w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label="Courbe des ventes">
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.55)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.05)" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="rgba(56,189,248,0.95)" strokeWidth="2.2" points={points} />
        <polygon fill="url(#salesGradient)" points={`0,100 ${points} 100,100`} />
      </svg>
      <div className="grid grid-cols-6 gap-2 text-[10px] uppercase tracking-wider text-zinc-500 md:grid-cols-12">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
