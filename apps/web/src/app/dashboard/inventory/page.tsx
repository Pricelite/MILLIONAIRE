import { Surface } from "@/components/ui/surface";
import { ProgressRow } from "@/components/ui/progress-row";
import { inventoryItems } from "@/lib/mock-data";

export default function InventoryPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
      <Surface className="overflow-hidden">
        <div className="grid grid-cols-5 gap-0 border-b border-white/10 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <span>Ingredient</span>
          <span>Stock</span>
          <span>Seuil min</span>
          <span>Fournisseur</span>
          <span>Dernier achat</span>
        </div>
        {inventoryItems.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-b-0">
            <span className="font-semibold text-zinc-100">{item.ingredient}</span>
            <span className="text-zinc-300">{item.currentKg} kg</span>
            <span className="text-zinc-300">{item.minKg} kg</span>
            <span className="text-zinc-400">{item.supplier}</span>
            <span className="text-zinc-400">{item.lastPurchase}</span>
          </div>
        ))}
      </Surface>

      <Surface className="space-y-4 p-4 md:p-5">
        <h3 className="text-lg font-bold text-white">Alertes & pertes</h3>
        {inventoryItems.map((item) => {
          const percent = (item.currentKg / item.minKg) * 100;
          return <ProgressRow key={item.id} label={item.ingredient} value={`${item.currentKg}kg`} percent={percent} danger={percent < 100} />;
        })}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-300">Deduction automatique activee sur 87% des articles ventes.</div>
      </Surface>
    </div>
  );
}
