import { Surface } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/status-badge";
import { reservations } from "@/lib/mock-data";

const timeline = ["11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "19:30", "20:00", "20:30", "21:00"];

export default function ReservationsPage() {
  return (
    <div className="space-y-4">
      <Surface className="p-4 md:p-5">
        <h3 className="mb-3 text-lg font-bold text-white">Timeline reservations</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 md:grid-cols-5">
          {timeline.map((slot) => (
            <div key={slot} className="rounded-xl border border-white/10 bg-zinc-900/60 p-2 text-center">
              {slot}
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="overflow-hidden">
        <div className="grid grid-cols-6 gap-0 border-b border-white/10 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <span>Client</span>
          <span>Personnes</span>
          <span>Heure</span>
          <span>Table</span>
          <span>Canal</span>
          <span>Statut</span>
        </div>
        {reservations.map((reservation) => (
          <div key={reservation.id} className="grid grid-cols-6 gap-0 border-b border-white/5 px-4 py-3 text-sm last:border-b-0">
            <span className="font-semibold text-zinc-100">{reservation.name}</span>
            <span className="text-zinc-300">{reservation.people}</span>
            <span className="text-zinc-300">{reservation.time}</span>
            <span className="text-zinc-300">{reservation.table}</span>
            <span className="text-zinc-400">{reservation.channel}</span>
            <StatusBadge label={reservation.status} tone={reservation.status === "Confirmee" ? "success" : "warning"} />
          </div>
        ))}
      </Surface>

      <Surface className="grid gap-3 p-4 text-sm text-zinc-300 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">Attribution automatique table activee</div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">SMS de rappel: 18 envoyes</div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">Email de confirmation: 92% delivres</div>
      </Surface>
    </div>
  );
}
