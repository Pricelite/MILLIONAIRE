import { currency, percent } from "@restomaster/utils";

import { MiniAreaChart } from "@/components/ui/mini-area-chart";
import { Surface } from "@/components/ui/surface";
import { advancedStats, salesSeries } from "@/lib/mock-data";

const heatmapRows = [
  [20, 24, 34, 42, 58, 61, 38],
  [16, 21, 29, 37, 53, 67, 40],
  [11, 18, 24, 32, 49, 60, 33],
  [9, 14, 20, 28, 45, 57, 30]
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Surface className="p-4"><p className="text-xs text-zinc-400">CA mensuel</p><p className="text-2xl font-black text-white">{currency(advancedStats.monthlyRevenue)}</p></Surface>
        <Surface className="p-4"><p className="text-xs text-zinc-400">CA annuel</p><p className="text-2xl font-black text-white">{currency(advancedStats.yearlyRevenue)}</p></Surface>
        <Surface className="p-4"><p className="text-xs text-zinc-400">Marge</p><p className="text-2xl font-black text-white">{percent(advancedStats.marginRate)}</p></Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Surface className="p-4">
          <h3 className="mb-2 text-lg font-bold text-white">Tendance ventes</h3>
          <MiniAreaChart values={salesSeries.map((point) => point.sales)} labels={salesSeries.map((point) => point.label)} />
        </Surface>

        <Surface className="space-y-3 p-4">
          <h3 className="text-lg font-bold text-white">Top produits</h3>
          {advancedStats.topProducts.map((product) => (
            <div key={product.name} className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200">
              {product.name} <span className="text-zinc-400">({product.sold} ventes)</span>
            </div>
          ))}
          <p className="text-xs text-zinc-400">Heures de pointe: {advancedStats.peakHours.join(" - ")}</p>
        </Surface>
      </div>

      <Surface className="p-4">
        <h3 className="mb-3 text-lg font-bold text-white">Heatmap activite</h3>
        <div className="space-y-2">
          {heatmapRows.map((row, idx) => (
            <div key={`row-${idx}`} className="grid grid-cols-7 gap-2">
              {row.map((cell, index) => (
                <div
                  key={`cell-${idx}-${index}`}
                  className="h-8 rounded-md"
                  style={{ backgroundColor: `rgba(56, 189, 248, ${Math.max(0.15, cell / 80)})` }}
                  title={`${cell} interactions`}
                />
              ))}
            </div>
          ))}
        </div>
      </Surface>

      <div className="grid gap-3 md:grid-cols-2">
        <button type="button" className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-left text-sm font-semibold text-zinc-200">Exporter PDF</button>
        <button type="button" className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-left text-sm font-semibold text-zinc-200">Exporter Excel</button>
      </div>
    </div>
  );
}
