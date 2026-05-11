import { Surface } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/status-badge";
import { loyalty } from "@/lib/mock-data";

function tone(tier: string) {
  if (tier === "VIP") return "warning" as const;
  if (tier === "Gold") return "info" as const;
  return "neutral" as const;
}

export default function LoyaltyPage() {
  return (
    <div className="space-y-4">
      <Surface className="grid gap-3 p-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-300">Points distribues ce mois: 148 200</div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-300">Clients VIP actifs: 31</div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-300">Coupons utilises: 64</div>
      </Surface>

      <Surface className="overflow-hidden">
        <div className="grid grid-cols-6 gap-0 border-b border-white/10 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <span>Client</span>
          <span>Niveau</span>
          <span>Points</span>
          <span>Derniere commande</span>
          <span>Promo</span>
          <span>Action</span>
        </div>
        {loyalty.map((customer) => (
          <div key={customer.id} className="grid grid-cols-6 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-b-0">
            <span className="font-semibold text-zinc-100">{customer.name}</span>
            <StatusBadge label={customer.tier} tone={tone(customer.tier)} />
            <span className="text-zinc-300">{customer.points}</span>
            <span className="text-zinc-300">{customer.lastOrder}</span>
            <span className="text-zinc-400">{customer.coupon}</span>
            <button type="button" className="rounded-xl border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs text-zinc-200">Envoyer coupon</button>
          </div>
        ))}
      </Surface>
    </div>
  );
}
